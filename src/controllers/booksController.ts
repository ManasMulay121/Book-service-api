import { Request, Response } from 'express';
import pool from '../databasepg';

export const getBooks = async(req : Request, res : Response) => {
    try {
        const books = await pool.query(`SELECT * FROM book`);
        res.json(books.rows);
    } catch (error) {
        console.log(error);
    }
}

export const getBookById = async(req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const book = await pool.query(`SELECT * FROM book WHERE book_id = $1`, [id]);
        if(book.rows.length === 0){
            res.status(404).json({ message : "Book not found"});
        }
        res.json(book.rows[0]);
    } catch (error) {
        console.log(error);

    }
}
export const createBook = async(req : Request, res : Response) => {
    try {
        const {title} = req.body;
        const {published_year} = req.body;
        const addBook = await pool.query("INSERT INTO book(title, published_year) VALUES ($1, $2) RETURNING *", [title, published_year])
        res.json(addBook.rows[0]);
    } catch (error) {
        console.log(error);
    }
}


// const BOOKS_FILE = path.join(__dirname, '../data/books.json');

// let nextBookId = 1;
// const existingBooks : Book[] = readJSON(BOOKS_FILE);
// if(existingBooks.length > 0){
//     const lastBook : Book = existingBooks[existingBooks.length - 1];
//     nextBookId = lastBook._id + 1;
// }

// export const getBooks = (req : Request, res : Response) : void => {
//     const books = readJSON(BOOKS_FILE);
//     res.json(books);
// }
// export const getBookById = (req : Request, res : Response) : void => {
//     const books : Book[] = readJSON(BOOKS_FILE);
//     const book = books.find(b => b._id === Number(req.params.id))
//     if(!book){
//         res.status(404).json({message : 'Book not found'});
//         return;
//     }
//     res.json(book);
// }
// export const createBook = (req : Request, res : Response) : void => {
//     const books : Book[] = readJSON(BOOKS_FILE);
//     const newBook : Book = {
//         _id : nextBookId++,
//         title: req.body.title,
//         publishedYear : req.body.publishedYear,
//         authorIds : req.body.authorIds   
//     };
//     books.push(newBook);
//     writeJSON(BOOKS_FILE, books);
//     res.status(201).json(newBook);
// } 
// export const updateBook = (req : Request, res : Response) : void => {
//     const books : Book[] = readJSON(BOOKS_FILE);
//     const index = books.findIndex(b => b._id === Number(req.params.id));
//     if(index === -1){
//         res.status(404).json({message : 'Book not found'});
//         return;
//     }
//     books[index] = { ...books[index], ...req.body};
//     writeJSON(BOOKS_FILE, books);
//     res.json(books[index]);
// }
// export const deleteBook = (req : Request, res : Response) : void => {
//     let books : Book[] = readJSON(BOOKS_FILE);
//     const index = books.findIndex(b => b._id === Number(req.params.id));
//     if(index === -1){
//         res.status(404).json({message : 'Book not found'});
//         return;
//     }
//     const deleted = books.splice(index, 1);
//     writeJSON(BOOKS_FILE, books);
//     res.json(deleted[0]);
// }

