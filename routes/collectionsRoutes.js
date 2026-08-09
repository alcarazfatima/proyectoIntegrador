import express from 'express';
import {
    getMisColecciones,
    postCrearColeccion,
    postGuardarEnColeccion,
    postCrearYGuardar,
    postEliminarColeccion,
    postQuitarPostDeColeccion
} from '../controllers/collectionController.js';

const router = express.Router();

router.get('/collections', getMisColecciones);
router.post('/collections/crear', postCrearColeccion);
router.post('/collections/guardar-post', postGuardarEnColeccion);
router.post('/collections/crear-y-guardar', postCrearYGuardar);
router.post('/collections/eliminar', postEliminarColeccion);
router.post('/collections/quitar-post', postQuitarPostDeColeccion);

export default router;