import express from 'express';
import { getPerfilusuario, postSeguirUsuario, postDejarDeSeguir } from '../controllers/userController.js';
import { getBuscarPublicaciones } from '../controllers/searchController.js';

const router = express.Router();
router.get('/profile/:username', getPerfilusuario);
router.post('/follow', postSeguirUsuario);
router.post('/follow/dejarDeSeguir', postDejarDeSeguir);
router.get('/search', getBuscarPublicaciones);

export default router;