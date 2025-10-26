import express from 'express';
import {
  startRemoteCharging,
  stopRemoteCharging
} from '../controllers/charger.controller.js';

const router = express.Router();

// POST /api/v1/chargers/:id/remote-start
// Start remote charging session
router.post('/:id/remote-start', startRemoteCharging);

// POST /api/v1/chargers/:id/remote-stop
// Stop remote charging session
router.post('/:id/remote-stop', stopRemoteCharging);

export default router;