import express from 'express';
import { getChatConUsuario, getConversaciones, postEnviarMensaje } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:userId', getChatConUsuario);
router.get('/', getConversaciones);
router.post('/enviar', postEnviarMensaje);

export default router;