import express from 'express';
const router = express.Router();
import { getHome } from '../controllers/postController.js';

// Cuando el usuario (o invitado) entre a la raíz, se ejecuta getHome
router.get('/home', getHome);

export default router;