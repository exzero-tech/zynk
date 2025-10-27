import { type Request, type Response } from 'express';
import { sendRemoteStartTransaction, sendRemoteStopTransaction } from '../ocpp/ocpp.remote.js';
import { PrismaClient } from '@prisma/client';
import * as chargerService from '../services/charger.service.js';
import { validateChargerPayload } from '../utils/validation.js';

const prisma = new PrismaClient();

// POST /api/v1/chargers/:id/remote-start
// Start remote charging session
export const startRemoteCharging = async (req: Request, res: Response) => {
  try {
    const { id: chargerId } = req.params;
    const { connectorId, idTag } = req.body;

    if (!chargerId || isNaN(parseInt(chargerId))) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CHARGER_ID', message: 'Valid charger ID required' }
      });
    }

    if (!connectorId || !idTag) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'connectorId and idTag required' }
      });
    }

    const charger = await prisma.charger.findUnique({
      where: { id: parseInt(chargerId) }
    });

    if (!charger || !charger.ocppChargePointId) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHARGER_NOT_FOUND', message: 'OCPP charger not found' }
      });
    }

    const response = await sendRemoteStartTransaction(
      charger.ocppChargePointId,
      connectorId,
      idTag
    );

    if (response.success) {
      const session = await prisma.chargingSession.create({
        data: {
          reservationId: 1, // TODO: Get from actual reservation
          driverId: 1, // TODO: Get from authenticated user
          chargerId: charger.id,
          startTime: new Date(),
          status: 'IN_PROGRESS',
          ocppTransactionId: response.transactionId?.toString() || null
        }
      });

      res.json({
        success: true,
        data: {
          session: {
            id: session.id,
            status: session.status,
            transactionId: response.transactionId
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'REMOTE_COMMAND_FAILED', message: 'Failed to start charging' }
      });
    }

  } catch (error) {
    console.error('Error in remote-start:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
};

// POST /api/v1/chargers/:id/remote-stop
// Stop remote charging session
export const stopRemoteCharging = async (req: Request, res: Response) => {
  try {
    const { id: chargerId } = req.params;
    const { transactionId } = req.body;

    if (!chargerId || isNaN(parseInt(chargerId))) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CHARGER_ID', message: 'Valid charger ID required' }
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TRANSACTION_ID', message: 'transactionId required' }
      });
    }

    const charger = await prisma.charger.findUnique({
      where: { id: parseInt(chargerId) }
    });

    if (!charger || !charger.ocppChargePointId) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHARGER_NOT_FOUND', message: 'OCPP charger not found' }
      });
    }

    const response = await sendRemoteStopTransaction(
      charger.ocppChargePointId,
      transactionId
    );

    if (response.success) {
      await prisma.chargingSession.updateMany({
        where: {
          chargerId: charger.id,
          ocppTransactionId: transactionId.toString(),
          status: 'IN_PROGRESS'
        },
        data: {
          endTime: new Date(),
          status: 'COMPLETED'
        }
      });

      res.json({
        success: true,
        data: { transactionId }
      });
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'REMOTE_COMMAND_FAILED', message: 'Failed to stop charging' }
      });
    }

  } catch (error) {
    console.error('Error in remote-stop:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
};

// POST /api/v1/chargers
export const createCharger = async (req: Request, res: Response) => {
  try {
    const role = (req.headers['x-user-role'] as string) || '';
    const userIdHeader = (req.headers['x-user-id'] as string) || '';

    // Basic host-only enforcement — API Gateway should enforce JWT in production
    if (role.toLowerCase() !== 'host') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Host role required' } });
    }

    const hostId = parseInt(userIdHeader) || req.body.hostId;
    const payload = req.body;

    const validation = validateChargerPayload(payload);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_PAYLOAD', message: validation.message } });
    }

    const created = await chargerService.createCharger({ ...payload, hostId });

    return res.status(201).json({ success: true, data: { charger: created } });
  } catch (error) {
    console.error('Error creating charger:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not create charger' } });
  }
};

// GET /api/v1/chargers
export const getChargers = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const chargers = await chargerService.getChargers(filters as any);
    return res.json({ success: true, data: { chargers } });
  } catch (error) {
    console.error('Error fetching chargers:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not fetch chargers' } });
  }
};

// GET /api/v1/chargers/:id
export const getChargerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const charger = await chargerService.getChargerById(parseInt(id));
    if (!charger) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Charger not found' } });
    return res.json({ success: true, data: { charger } });
  } catch (error) {
    console.error('Error getting charger by id:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not fetch charger' } });
  }
};

// PUT /api/v1/chargers/:id
export const updateCharger = async (req: Request, res: Response) => {
  try {
    const role = (req.headers['x-user-role'] as string) || '';
    if (role.toLowerCase() !== 'host') return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Host role required' } });

    const { id } = req.params;
    const payload = req.body;
    const validation = validateChargerPayload(payload, { partial: true });
    if (!validation.valid) return res.status(400).json({ success: false, error: { code: 'INVALID_PAYLOAD', message: validation.message } });

    const updated = await chargerService.updateCharger(parseInt(id), payload);
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Charger not found' } });
    return res.json({ success: true, data: { charger: updated } });
  } catch (error) {
    console.error('Error updating charger:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not update charger' } });
  }
};

// DELETE /api/v1/chargers/:id
export const deleteCharger = async (req: Request, res: Response) => {
  try {
    const role = (req.headers['x-user-role'] as string) || '';
    if (role.toLowerCase() !== 'host') return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Host role required' } });

    const { id } = req.params;
    const deleted = await chargerService.deleteCharger(parseInt(id));
    if (!deleted) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Charger not found' } });
    return res.json({ success: true, data: { id: parseInt(id) } });
  } catch (error) {
    console.error('Error deleting charger:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not delete charger' } });
  }
};

// GET /api/v1/chargers/host/:hostId
export const getChargersByHost = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    const chargers = await chargerService.getChargersByHost(parseInt(hostId));
    return res.json({ success: true, data: { chargers } });
  } catch (error) {
    console.error('Error fetching chargers by host:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not fetch chargers' } });
  }
};

// PATCH /api/v1/chargers/:id/status
export const patchChargerStatus = async (req: Request, res: Response) => {
  try {
    const role = (req.headers['x-user-role'] as string) || '';
    if (role.toLowerCase() !== 'host') return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Host role required' } });

    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: { code: 'INVALID_PAYLOAD', message: 'status required' } });

    const updated = await chargerService.updateCharger(parseInt(id), { status });
    if (!updated) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Charger not found' } });
    return res.json({ success: true, data: { charger: updated } });
  } catch (error) {
    console.error('Error patching charger status:', error);
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not update status' } });
  }
};