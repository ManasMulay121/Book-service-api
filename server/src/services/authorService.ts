import pool from '../databasepg';
import { authorQueries } from '../queries';
import { ServiceReturn } from '../models/ServiceResult';
import { author } from '../models/authors';

export const getAuthors = async (): Promise<ServiceReturn<author[]>> => {
  try {
    const authors = await pool.query<author>(authorQueries.SELECT_ALL);
    if (authors.rowCount === 0) {
      return {
        status: 'error',
        data: null,
        error: 'No authors found',
        statusCode: 404,
      };
    }
    return {
      status: 'success',
      data: authors.rows,
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not fetch authors',
      statusCode: 500,
    };
  }
};

export const getAuthorById = async (
  id: string
): Promise<ServiceReturn<author>> => {
  try {
    const result = await pool.query<author>(authorQueries.SELECT_ID, [id]);
    if (result.rowCount === 0) {
      return {
        status: 'error',
        data: null,
        error: `Author with id ${id} not found`,
        statusCode: 404,
      };
    }
    return {
      status: 'success',
      data: result.rows[0],
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not fetch author',
      statusCode: 500,
    };
  }
};

export const createAuthor = async (
  name: string,
  bio: string
): Promise<ServiceReturn<author>> => {
  try {
    const yyyyMMdd: string = new Date().toISOString().slice(0, 10);
    const result = await pool.query<author>(authorQueries.CREATE, [
      name,
      bio,
      yyyyMMdd,
    ]);
    return {
      status: 'success',
      data: result.rows[0],
      error: null,
      statusCode: 201,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not create author',
      statusCode: 500,
    };
  }
};

export const updateAuthor = async (
  id: string,
  name: string,
  bio: string
): Promise<ServiceReturn<author>> => {
  try {
    const yyyyMMdd: string = new Date().toISOString().slice(0, 10);
    const result = await pool.query<author>(authorQueries.UPDATE, [
      name,
      bio,
      yyyyMMdd,
      id,
    ]);
    if (result.rowCount === 0) {
      return {
        status: 'error',
        data: null,
        error: `Author with id ${id} not found`,
        statusCode: 404,
      };
    }
    return {
      status: 'success',
      data: result.rows[0],
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not update author',
      statusCode: 500,
    };
  }
};

export const deleteAuthor = async (
  id: string
): Promise<ServiceReturn<author>> => {
  try {
    await pool.query<author>(authorQueries.DELETE_AUTHOR_REL, [id]);
    const result = await pool.query<author>(authorQueries.DELETE, [id]);
    if (result.rowCount === 0) {
      return {
        status: 'error',
        data: null,
        error: 'Author not found, enter correct author_id',
        statusCode: 404,
      };
    }
    return {
      status: 'success',
      data: result.rows[0],
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      data: null,
      error: 'Server error, could not delete author',
      statusCode: 500,
    };
  }
};
