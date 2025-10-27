import express from 'express';
import {
  startRemoteCharging,
  stopRemoteCharging,
  createCharger,
  getChargers,
  getChargerById,
  updateCharger,
  deleteCharger,
  getChargersByHost,
  patchChargerStatus
} from '../controllers/charger.controller.js';

const router = express.Router();

// Charger CRUD
// POST /api/v1/chargers
router.post('/', createCharger);

// GET /api/v1/chargers
router.get('/', getChargers);

// GET /api/v1/chargers/:id
router.get('/:id', getChargerById);

// PUT /api/v1/chargers/:id
router.put('/:id', updateCharger);

// DELETE /api/v1/chargers/:id
router.delete('/:id', deleteCharger);

// GET chargers by host
router.get('/host/:hostId', getChargersByHost);

// PATCH /api/v1/chargers/:id/status
router.patch('/:id/status', patchChargerStatus);

// Remote commands (OCPP)
router.post('/:id/remote-start', startRemoteCharging);
router.post('/:id/remote-stop', stopRemoteCharging);

export default router;