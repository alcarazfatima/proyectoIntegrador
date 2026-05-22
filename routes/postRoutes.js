import express from 'express';
import multer from 'multer';
import { getHome, getCrearPost, postCrearPost } from '../controllers/postController.js';

const router = express.Router();
// Configuración de Multer para trabajar con los archivos en memoria (Buffers)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por foto
});

// Cuando el usuario (o invitado) entre a la raíz, se ejecuta getHome
router.get('/home', getHome);
router.get('/newPost', getCrearPost);
router.post('/newPost', upload.array('imagenes', 5), postCrearPost);

export default router;