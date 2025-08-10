import express from 'express';
import { auth } from '../Middleware/authMiddleware';
import { getAuthorCtrl, getAuthorByIdCtrl, createAuthorCtrl, updateAuthorCtrl, deleteAuthorCtrl} from '../controllers/authorsController';
const router = express.Router();

router.get('/', getAuthorCtrl);
router.get('/:id', getAuthorByIdCtrl);
router.post('/', auth,createAuthorCtrl);
router.put('/:id', auth, updateAuthorCtrl);
router.delete('/:id', auth, deleteAuthorCtrl);
export default router;
