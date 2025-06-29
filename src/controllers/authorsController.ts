import { Request, Response } from 'express';
import {readJSON, writeJSON} from '../utils/fileUtils'
import { Author } from '../models/author';
const path = require('path');

// const AUTHORS_FILE = '../data/author.json';

// Initialize next ID based on existing authors
let nextAuthorId = 1;
const AUTHORS_FILE = path.join(__dirname, '../data/author.json');
const existingAuthors: Author[] = readJSON(AUTHORS_FILE);
if (existingAuthors.length > 0) {
    const lastAuthor : Author = existingAuthors[existingAuthors.length - 1];
    nextAuthorId = lastAuthor._id + 1;
}

export const getAuthors = (req: Request, res: Response): void => {
    const authors = readJSON(AUTHORS_FILE);
    res.json(authors);
};

export const getAuthorById = (req: Request, res: Response): void => {
    const authors: Author[] = readJSON(AUTHORS_FILE);
    const author = authors.find(a => a._id === Number(req.params.id));
    if (!author) {
        res.status(404).json({ message: 'Author not found' });
        return;
    }
    res.json(author);
};

export const createAuthor = (req: Request, res: Response): void => {
    const authors: Author[] = readJSON(AUTHORS_FILE);
    const newAuthor: Author = {
        _id: nextAuthorId++,
        name: req.body.name,
        bio: req.body.bio || ''
    };
    authors.push(newAuthor);
    writeJSON(AUTHORS_FILE, authors);
    res.status(201).json(newAuthor);
};

export const updateAuthor = (req: Request, res: Response): void => {
    const authors: Author[] = readJSON(AUTHORS_FILE);
    const index = authors.findIndex(a => a._id === Number(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Author not found' });
        return;
    }
    authors[index] = { ...authors[index], ...req.body };
    writeJSON(AUTHORS_FILE, authors);
    res.json(authors[index]);
};

export const deleteAuthor = (req: Request, res: Response): void => {
    let authors: Author[] = readJSON(AUTHORS_FILE);
    const index = authors.findIndex(a => a._id === Number(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Author not found' });
        return;
    }
    const deleted = authors.splice(index, 1);
    writeJSON(AUTHORS_FILE, authors);
    res.json(deleted[0]);
};