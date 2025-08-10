import { Request, Response } from 'express';
import { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from '../services/authorService';
import { error } from 'console';

export const getAuthorCtrl = async (req: Request, res: Response) => {
    try {
        const authors = await getAuthors();
        if (authors.status === 'error') {
            res.status(authors.statusCode).json({data : authors.data, error : authors.error, status : authors.status});
            return;
        }
        res.status(authors.statusCode).json({data : authors.data, status : authors.status, error : authors.error});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', data: null, error: 'Server error, could not fetch Authors' });
    }
};

export const getAuthorByIdCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const author = await getAuthorById(id);
        if (author.status === 'error') {
            res.status(author.statusCode).json({data : author.data, error : author.error, status : author.status});
            return;
        }
        res.status(author.statusCode).json({data : author.data, status : author.status, error : author.error, });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', data: null, error: 'Server error, Could not fetch author' });
    }
};

export const createAuthorCtrl = async (req: Request, res: Response) => {
    try {
        const { name, bio, utcTimeString } = req.body;
        const addAuthor = await createAuthor(name, bio, utcTimeString);
        res.status(addAuthor.statusCode).json({data : addAuthor.data, error : addAuthor.error, status : addAuthor.status});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', data: null, error: 'Server error, could not create Author' });
    }
};

export const updateAuthorCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, bio, utcTimeString } = req.body;
        const updatedAuthor = await updateAuthor(id, name, bio, utcTimeString);
        res.status(updatedAuthor.statusCode).json({data : updatedAuthor.data, error : updatedAuthor.error, status : updatedAuthor.status});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'Server error, could not update Author', data: null });
    }
};

export const deleteAuthorCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await deleteAuthor(id);
        // result can be QueryResult or error object
        res.status(result.statusCode).json({data : result.data, error : result.error, status : result.status});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', data: null, error: 'Server error, could not delete Author' });
    }
};