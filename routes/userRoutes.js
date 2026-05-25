import express from 'express';
import { getPerfilusuario, postSeguirUsuario } from '../controllers/userController.js';

const router = express.Router();
router.get('/profile', getPerfilusuario);
router.post('/follow', postSeguirUsuario)

export default router;