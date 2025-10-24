import express from 'express';
import { authenticateJWT } from '../auth/auth.middleware';

import {
  getBooksCtrl,
  getBookByIdCtrl,
  createBookCtrl,
  updateBookCtrl,
  deleteBookCtrl,
} from './books.controller';
const router = express.Router();
router.get('/', getBooksCtrl);
router.get('/:id', getBookByIdCtrl);
router.post('/', authenticateJWT, createBookCtrl);
router.put('/:id', authenticateJWT, updateBookCtrl);
router.delete('/:id', authenticateJWT, deleteBookCtrl);

export default router;
