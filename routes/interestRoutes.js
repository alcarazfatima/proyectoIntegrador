import express from 'express';
import { postMeInteresa } from '../controllers/interestController.js';

const router = express.Router();

router.post('/me-interesa', postMeInteresa);

export default router;
