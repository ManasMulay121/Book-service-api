import { Request, Response } from 'express';
import pool from '../databasepg';

export const getAuthors = async(req : Request, res : Response) => {
    try {
        const authors = await pool.query(`SELECT * FROM author`);
        res.json(authors.rows);
    } catch (error) {
        console.log(error);
    }
}

export const getAuthorById = async(req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const author = await pool.query(`SELECT * FROM author WHERE book_id = $1`, [id]);
        if(author.rows.length === 0){
            res.status(404).json({ message : "Author not found"});
        }
        res.json(author.rows[0]);
    } catch (error) {
        console.log(error);

    }
}
export const createAuthor = async(req : Request, res : Response) => {
    try {
        const {name, bio} = req.body;
        const addAuthor = await pool.query("INSERT INTO author(name, bio) VALUES ($1, $2) RETURNING *", [name, bio])
        res.json(addAuthor.rows[0]);
    } catch (error) {
        console.log(error);
    }
}



// // const AUTHORS_FILE = '../data/author.json';

// // Initialize next ID based on existing authors
// let nextAuthorId = 1;
// const AUTHORS_FILE = path.join(__dirname, '../data/author.json');
// const existingAuthors: Author[] = readJSON(AUTHORS_FILE);
// if (existingAuthors.length > 0) {
//     const lastAuthor : Author = existingAuthors[existingAuthors.length - 1];
//     nextAuthorId = lastAuthor._id + 1;
// }

// export const getAuthors = (req: Request, res: Response): void => {
//     const authors = readJSON(AUTHORS_FILE);
//     res.json(authors);
// };

// export const getAuthorById = (req: Request, res: Response): void => {
//     const authors: Author[] = readJSON(AUTHORS_FILE);
//     const author = authors.find(a => a._id === Number(req.params.id));
//     if (!author) {
//         res.status(404).json({ message: 'Author not found' });
//         return;
//     }
//     res.json(author);
// };

// export const createAuthor = (req: Request, res: Response): void => {
//     const authors: Author[] = readJSON(AUTHORS_FILE);
//     const newAuthor: Author = {
//         _id: nextAuthorId++,
//         name: req.body.name,
//         bio: req.body.bio || ''
//     };
//     authors.push(newAuthor);
//     writeJSON(AUTHORS_FILE, authors);
//     res.status(201).json(newAuthor);
// };

// export const updateAuthor = (req: Request, res: Response): void => {
//     const authors: Author[] = readJSON(AUTHORS_FILE);
//     const index = authors.findIndex(a => a._id === Number(req.params.id));
//     if (index === -1) {
//         res.status(404).json({ message: 'Author not found' });
//         return;
//     }
//     authors[index] = { ...authors[index], ...req.body };
//     writeJSON(AUTHORS_FILE, authors);
//     res.json(authors[index]);
// };

// export const deleteAuthor = (req: Request, res: Response): void => {
//     let authors: Author[] = readJSON(AUTHORS_FILE);
//     const index = authors.findIndex(a => a._id === Number(req.params.id));
//     if (index === -1) {
//         res.status(404).json({ message: 'Author not found' });
//         return;
//     }
//     const deleted = authors.splice(index, 1);
//     writeJSON(AUTHORS_FILE, authors);
//     res.json(deleted[0]);
// };