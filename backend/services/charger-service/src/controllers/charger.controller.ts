import { type Request, type Response } from 'express';
import { sendRemoteStartTransaction, sendRemoteStopTransaction } from '../ocpp/ocpp.remote.js';
import { PrismaClient } from '@prisma/client';

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