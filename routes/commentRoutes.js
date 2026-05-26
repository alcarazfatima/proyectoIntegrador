import express from 'express';
import { postCrearComentario } from '../controllers/commentController.js';

const router = express.Router();

router.post('/comment', postCrearComentario);

export default router;