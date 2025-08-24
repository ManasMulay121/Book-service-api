import { Request, Response } from 'express';
import pool from '../databasepg';

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await pool.query(`SELECT * FROM author`);
    if (authors.rowCount === 0) {
      res
        .status(404)
        .json({ message: 'Authors do not exist yet, add them first' });
    }
    res.json(authors.rows);
  } catch (error) {
    console.log(error);
  }
};

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = await pool.query(
      `SELECT * FROM author WHERE author_id = $1`,
      [id]
    );
    if (author.rowCount === 0) {
      res.status(404).json({ message: 'Author not found' });
    }
    res.json(author.rows[0]);
  } catch (error) {
    console.log(error);
  }
};
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, bio } = req.body;
    const addAuthor = await pool.query(
      'INSERT INTO author(name, bio) VALUES ($1, $2) RETURNING *',
      [name, bio]
    );
    res.status(201).json({
      message: 'new Author successfully added',
      author: addAuthor.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not add author into database' });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    const updatedAuthor = await pool.query(
      'UPDATE author SET name = $1, bio = $2 WHERE author_id = $3',
      [name, bio, id]
    );
    if (updatedAuthor.rowCount === 0) {
      res
        .status(404)
        .json({ message: 'Author not found, enter correct author ID' });
      return;
    }
    res.status(201).json({
      message: 'Author details updated successfully',
      author: updatedAuthor.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not update Author, Server error' });
  }
};
