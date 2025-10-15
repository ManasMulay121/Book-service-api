import pool from '../databasepg';
import { bookQueries } from '../queries';
import { ServiceReturn } from '../models/ServiceResult';
import { book } from '../models/books';

export const getBooks = async (): Promise<ServiceReturn<book[]>> => {
  try {
    const books = await pool.query<book>(bookQueries.SELECT_ALL);
    if (books.rowCount === 0) {
      return {
        data: null,
        error: 'Books not found',
        status: 'error',
        statusCode: 404,
      };
    }
    return {
      data: books.rows,
      status: 'success',
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      status: 'error',
      data: null,
      error: 'Server error, could not fetch books',
    };
  }
};

export const getBookById = async (id: string): Promise<ServiceReturn<book>> => {
  try {
    const result = await pool.query<book>(bookQueries.SELECT_ID, [id]);
    if (result.rowCount === 0) {
      return {
        data: null,
        status: 'error',
        error: 'Book not found, enter correct book id',
        statusCode: 404,
      };
    }
    return {
      status: 'success',
      error: null,
      data: result.rows[0],
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      statusCode: 500,
      error: 'Server error, could not fetch book',
      data: null,
    };
  }
};
export const createBook = async (
  title: string,
  published_year: string,
  authorIds: string[]
): Promise<ServiceReturn<book>> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const yyyyMMdd: string = new Date().toISOString().slice(0, 10);
    const addBook = await client.query<{ book_id: string }>(
      bookQueries.CREATE,
      [title, published_year, yyyyMMdd]
    );
    const bookid = addBook.rows[0].book_id;
    for (const author of authorIds) {
      const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [
        author,
      ]);
      if (checkAuthor.rowCount === 0) {
        await client.query('ROLLBACK');
        return {
          status: 'error',
          statusCode: 404,
          error: 'Author not found',
          data: null,
        };
      }
      await client.query(bookQueries.INSERT_BOOK_AUTHOR, [bookid, author]);
    }
    await client.query('COMMIT');
    const returnBook = await client.query<book>(bookQueries.SELECT_ID, [
      bookid,
    ]);
    return {
      data: returnBook.rows[0],
      status: 'success',
      statusCode: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    await client.query('ROLLBACK');
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not update book',
      statusCode: 500,
    };
  }
};

export const updateBook = async (
  id: string,
  title: string,
  published_year: string,
  authorIds: string[]
): Promise<ServiceReturn<book>> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const yyyyMMdd: string = new Date().toISOString().slice(0, 10);
    const updatedbook = await client.query(bookQueries.UPDATE, [
      title,
      published_year,
      yyyyMMdd,
      id,
    ]);
    if (updatedbook.rowCount === 0) {
      await client.query('ROLLBACK');
      return {
        data: null,
        status: 'error',
        error: 'Book not found',
        statusCode: 404,
      };
    }
    for (const author of authorIds) {
      const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [
        author,
      ]);
      if (checkAuthor.rowCount === 0) {
        await client.query('ROLLBACK');
        return {
          data: null,
          status: 'error',
          statusCode: 404,
          error: 'Author not found, enter correct author id',
        };
      }
    }
    await client.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
    for (const author of authorIds) {
      await client.query(bookQueries.INSERT_BOOK_AUTHOR, [id, author]);
    }
    await client.query('COMMIT');
    const returnBook = await client.query<book>(bookQueries.SELECT_ID, [id]);
    return {
      status: 'success',
      statusCode: 200,
      data: returnBook.rows[0],
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      statusCode: 500,
      data: null,
      error: 'Server error, could not update book',
    };
  }
};

export const deleteBook = async (id: string): Promise<ServiceReturn<null>> => {
  try {
    const returnBook = await pool.query(bookQueries.SELECT_ID, [id]);
    if (returnBook.rowCount === 0) {
      return {
        status: 'error',
        statusCode: 404,
        error: 'Incorrect Book Id, Please enter correct book Id',
        data: null,
      };
    }
    await pool.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
    await pool.query(bookQueries.DELETE, [id]);
    return {
      status: 'success',
      statusCode: 200,
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      statusCode: 500,
      data: null,
      error: 'Server error, could not delete book',
    };
  }
};
