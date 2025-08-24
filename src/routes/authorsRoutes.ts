import express from 'express';
import {
  getAuthorById,
  getAuthors,
  createAuthor,
  updateAuthor,
} from '../controllers/authorsController';
// import {updateAuthor, deleteAuthor} from '../controllers/authorsController'
const router = express.Router();

router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.post('/', createAuthor);
router.put('/:id', updateAuthor);

export default router;
