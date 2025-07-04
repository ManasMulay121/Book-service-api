import express from 'express';
import {getBooks, getBookById, createBook} from  '../controllers/booksController'
// import {updateBook, createBook, deleteBook} from '../controllers/booksController'
const router = express.Router();
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
// router.put('/:id', updateBook);
// router.delete('/:id', deleteBook);

export default router;