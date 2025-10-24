import express from 'express';
import { loginUser } from './auth.controller';

const router = express.Router();

// POST /auth/login - User login endpoint
router.post('/login', loginUser);

export default router;
