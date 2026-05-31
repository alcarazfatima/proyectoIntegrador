import express from 'express';
import { getPerfilusuario, postSeguirUsuario, postDejarDeSeguir } from '../controllers/userController.js';

const router = express.Router();
router.get('/profile/:username', getPerfilusuario);
router.post('/follow', postSeguirUsuario);
router.post('/follow/dejarDeSeguir', postDejarDeSeguir);

export default router;