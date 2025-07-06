import { Request, Response } from 'express';
import pool from '../databasepg';
import { error } from 'console';

export const getBooks = async(req : Request, res : Response) => {
    try {
        const books = await pool.query(`SELECT 
                                            b.book_id, 
                                            b.title, 
                                            b.published_year, 
                                            json_agg(json_build_object('author_id', a.author_id, 
                                                        'name', a.name,
                                                        'bio', a.bio)) 	AS authors
                                        FROM book b
                                        JOIN book_author ba on ba.book_id = b.book_id
                                        JOIN author a on a.author_id = ba.author_id
                                        GROUP BY b.book_id, b.title, b.published_year;`);
        res.status(200).json(books.rows);
    } catch (error) {
        console.log(error);
    }
}

export const getBookById = async(req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const book = await pool.query(`SELECT 
                                            b.book_id, 
                                            b.title, 
                                            b.published_year, 
                                            json_agg(json_build_object('author_id', a.author_id, 
                                                        'name', a.name,
                                                        'bio', a.bio)) 	AS authors
                                        FROM book b
                                        JOIN book_author ba on ba.book_id = $1
                                        JOIN author a on a.author_id = ba.author_id
                                        WHERE b.book_id = $1
                                        GROUP BY b.book_id, b.title, b.published_year;`, [id]);
        if(book.rows.length === 0){
            res.status(404).json({ error : "Book not found"});
            return;
        }
        res.status(200).json(book.rows[0]);
    } catch (error) {
        console.log(error);

    }
}
export const createBook = async(req : Request, res : Response) => {
    const client = await pool.connect();
    try {
        
        const {title} = req.body;
        const {authorIds, published_year} = req.body;
        await client.query("BEGIN");
        const addBook = await client.query("INSERT INTO book(title, published_year) VALUES ($1, $2) RETURNING *", [title, published_year])
        const bookId = addBook.rows[0].book_id;

        for(const author of authorIds){
            const checkAuthor = await client.query("SELECT * FROM author WHERE author_id = $1", [author]);
            if(checkAuthor.rows.length === 0) {
                await client.query("ROLLBACK");
                res.status(404).json({message : `Author with id ${author} not found, create book again`});
                return;
            }
            await client.query("INSERT INTO book_author(book_id, author_id) VALUES ($1, $2)", [bookId, author]);
        }
        await client.query("COMMIT");
        res.status(201).json({ message : "Book created successfully" , book : addBook.rows[0]});
    } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        res.status(500).json({error : "Could not create book"});
    } finally {
        client.release();
    }
}

export const updateBook =  async(req : Request, res : Response) => {
    const client = await pool.connect();
    try {
        const {title, published_year, authorIds} = req.body;
        const {id} = req.params
        await client.query("BEGIN");
        const updatedbook = await client.query("UPDATE book SET title = $1, published_year = $2 WHERE book_id = $3", [title, published_year, id]);
        if(updatedbook.rowCount === 0){
            await client.query("ROLLBACK");
            res.status(404).json({message : "Book not found"});
            return;
        }
        for (const author of authorIds){
            const checkAuthor = await client.query("SELECT * FROM author WHERE author_id = $1", [author]);
            if(checkAuthor.rows.length === 0){
                await client.query("ROLLBACK");
                res.status(404).json({error : `Author not found id : ${author}, please update again with correct author ids`});
                return;
            }
            await client.query("INSERT INTO book_author (book_id, author_id) VALUES($1, $2) ON CONFLICT DO NOTHING", [id, author])
        }
        await client.query("COMMIT");
        res.status(200).json({
            message : "Book updated successfully!",
            book : updatedbook.rows[0]
        })
    
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);
        res.status(500).json({error : "Server error could not update book!"});
    } finally{
        client.release();
    }
}

export const deleteBook = async (req : Request, res : Response)  => {
    try {
        const {id} = req.params;
        const book_auth_rel = await pool.query("DELETE FROM book_author WHERE book_id = $1", [id]);
        const deletedBook = await pool.query("DELETE FROM book WHERE book_id = $1", [id]);
        if(deletedBook.rowCount === 0){
            res.status(404).json({message : "Book not found"});
            return;
        }
        res.status(200).json({message : "Book successfully deleted", book : deletedBook.rows[0]});
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Could not delete book server error"})
    }
}