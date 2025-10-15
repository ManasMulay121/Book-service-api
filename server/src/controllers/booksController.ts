import { Request, Response } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../services/bookService';

export const getBooksCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const books = await getBooks();
    res.status(books.statusCode).json({
      data: books.data,
      error: books.error,
      status: books.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Server error, could not fetch books',
    });
  }
};

export const getBookByIdCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await getBookById(req.params.id);
    res.status(book.statusCode).json({
      data: book.data,
      error: book.error,
      status: book.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Server error, could not fetch book',
    });
  }
};

export const createBookCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, published_year, authorIds } = req.body as {
      title: string;
      published_year: number;
      authorIds: string[];
    };
    const result = await createBook(title, String(published_year), authorIds);
    res.status(result.statusCode).json({
      data: result.data,
      error: result.error,
      status: result.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Server error, could not create book',
    });
  }
};

export const updateBookCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, published_year, authorIds } = req.body as {
      title: string;
      published_year: number;
      authorIds: string[];
    };
    const result = await updateBook(
      id,
      title,
      String(published_year),
      authorIds
    );
    res.status(result.statusCode).json({
      data: result.data,
      error: result.error,
      status: result.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Server error, could not update book',
    });
  }
};

export const deleteBookCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteBook(id);
    res.status(result.statusCode).json({
      data: result.data,
      error: result.error,
      status: result.status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Server error, could not delete book',
    });
  }
};
