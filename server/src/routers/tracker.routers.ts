import { Router } from 'express';
import { idCreate, idCreateLimiter } from '../controllers/tracker.controller.js';

const router = Router();

router.post('/getid', idCreateLimiter, idCreate);

export default router;