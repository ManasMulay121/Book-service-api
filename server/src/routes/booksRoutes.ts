import express from 'express';
import { auth } from '../Middleware/authMiddleware';
import {getBooksCtrl, getBookByIdCtrl, createBookCtrl, updateBookCtrl, deleteBookCtrl} from  '../controllers/booksController'
const router = express.Router();
router.get('/', getBooksCtrl);
router.get('/:id', getBookByIdCtrl);
router.post('/', auth, createBookCtrl);
router.put('/:id', auth, updateBookCtrl);
router.delete('/:id', auth, deleteBookCtrl);

export default router;