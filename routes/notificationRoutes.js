import express from 'express';
import { getNotification, postMarcarLeida } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/notifications', getNotification);
router.post('/notifications/:id/leer', postMarcarLeida);

export default router;