import express from 'express';
import { authenticateJWT } from '../auth/auth.middleware';
import {
  getAuthorCtrl,
  getAuthorByIdCtrl,
  createAuthorCtrl,
  updateAuthorCtrl,
  deleteAuthorCtrl,
} from './authors.controller';
const router = express.Router();

router.get('/', getAuthorCtrl);
router.get('/:id', getAuthorByIdCtrl);
router.post('/', authenticateJWT, createAuthorCtrl);
router.put('/:id', authenticateJWT, updateAuthorCtrl);
router.delete('/:id', authenticateJWT, deleteAuthorCtrl);
export default router;
