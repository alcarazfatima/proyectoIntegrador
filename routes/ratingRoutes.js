import express from 'express';
import { postValorar } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/posts/rating', postValorar);

export default router;