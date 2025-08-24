import { Request, Response } from 'express';
import pool from '../databasepg';
import { bookQueries } from '../queries';
import {ServiceReturn} from '../models/ServiceResult';
import { book } from '../models/books';
import { error } from 'console';
import { stat } from 'fs';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { author } from '../models/authors';

export const getBooks = async() : Promise<ServiceReturn<book[]>> => {
    try {
        const books = await pool.query(bookQueries.SELECT_ALL);
        if(books.rowCount === 0){
            return {
                data : null,
                error : "Books not found",
                status : 'error',
                statusCode : 404
            }
        }
        return {
            data : books.rows,
            status : 'success',
            error : null,
            statusCode : 200
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode : 500,
            status : 'error',
            data : null,
            error : "Server error, could not fetch books"
        }
    }
}

export const getBookById = async(id : string) : Promise<ServiceReturn<book>> => {
    try {
        const result = await pool.query(bookQueries.SELECT_ID, [id]);
        if(result.rowCount === 0){
            return {
                data : null,
                status : 'error',
                error : "Book not found, enter correct book id",
                statusCode : 404
            }
        }
        return {
            status : 'success',
            error : null,
            data : result.rows[0],
            statusCode : 200
        }
    } catch (error) {
        console.log(error);
        return {
            status : 'error',
            statusCode : 500,
            error : "Server error, could not fetch book",
            data : null
        }
    }
}
export const createBook = async(title : string, published_year : string, utcTimeString : string, authorIds : string []) : Promise<ServiceReturn<book>> => {
    const client = await pool.connect();
    // try {
    //     const yyyyMMdd : string = new Date(utcTimeString).toISOString().slice(0,10);
    //     await client.query("BEGIN");
    //     const addBook = await client.query(bookQueries.CREATE, [title, published_year, yyyyMMdd]);
    //     const bookId = addBook.rows[0].book_id
    //     for(const author of authorIds){
    //         const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [author]);
    //         if(checkAuthor.rowCount === 0){
    //             await client.query("ROLLBACK");
    //             return {
    //                 status : 'error',
    //                 statusCode : 404,
    //                 data : null,
    //                 error : `Author id ${author} not found`
    //             }
    //         }
    //         await client.query(bookQueries.INSERT_BOOK_AUTHOR, [bookId, author]);
    //     }
    //     await client.query("COMMIT");
    //     const returnData = await client.query(bookQueries.SELECT_ID, [bookId]);
    //     return {
    //         status : 'success',
    //         statusCode : 201, 
    //         error : null,
    //         data : returnData.rows[0]
    //     }
    // } catch (error) {
    //     throw error;
    // }
    try {
        await client.query("BEGIN");
        const yyyyMMdd : string = new Date(utcTimeString).toISOString().slice(0, 10);
        const addBook = await client.query(bookQueries.CREATE, [title, published_year, yyyyMMdd]);
        const bookid = addBook.rows[0].book_id 
        for(const author of authorIds){
            const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [author]);
            if(checkAuthor.rowCount === 0){
                await client.query("ROLLBACK");
                return {
                    status : 'error',
                    statusCode : 404,
                    error : 'Author not found',
                    data : null
                }
            }
            await client.query(bookQueries.INSERT_BOOK_AUTHOR, [bookid, author]);
        }
        await client.query("COMMIT");
        const returnBook = await client.query(bookQueries.SELECT_ID, [bookid]);
        return {
            data : returnBook.rows[0],
            status : 'success',
            statusCode : 201,
            error : null
        }
    } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
        return {
            status : 'error',
            data : null,
            error : 'Server error, could not update book',
            statusCode : 500
        }
    }
}

export const updateBook =  async(id : string ,title : string, published_year : string, authorIds : author[], utcTimeString : string) : Promise<ServiceReturn<book>> => {
    // const client = await pool.connect();
    // try {
    //     const {title, published_year, authorIds, utcTimeString} = req.body;
    //     const {id} = req.params;
    //     const yyyyMMdd : string = new Date(utcTimeString).toISOString().slice(0,10);
    //     await client.query("BEGIN");
    //     const updatedbook = await client.query(bookQueries.UPDATE, [title, published_year, yyyyMMdd, id]);
    //     if(updatedbook.rowCount === 0){
    //         await client.query("ROLLBACK");
    //         res.status(404).json({status : "error", error : "Incorrect Book id", data : null});
    //         return{
    //             status : 'error',
    //             statusCode : 404,
    //             data : null,
    //             error : 'Book not found, id incorrect'
    //         }
    //     }
    //     for (const author of authorIds){
    //         const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [author]);
    //         if(checkAuthor.rows.length === 0){
    //             await client.query("ROLLBACK");
                
    //             return {
    //                 status : 'error',
    //                 statusCode : 404,
    //                 data : null,
    //                 error : 
    //             }
    //         }
    //     }
    //     await client.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
    //     for(const author of authorIds){
    //         await client.query(bookQueries.INSERT_BOOK_AUTHOR,[id, author]);
    //     }
    //     await client.query("COMMIT");
    //     res.status(200).json({ status: "success", error : null, data : updatedbook.rows})
    // } catch (error) {
    //     await client.query("ROLLBACK");
    //     console.log(error);
    //     res.status(500).json({status : "error", data : null, error : "Server could not update the book"});
    // } finally{
    //     client.release();
    // }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const yyyyMMdd : string = new Date(utcTimeString).toISOString().slice(0, 10);
        const updatedbook = await client.query(bookQueries.UPDATE, [title, published_year, yyyyMMdd, id]);
        if(updatedbook.rowCount === 0){
            await client.query("ROLLBACK");
            return {
                data : null, 
                status : 'error',
                error : 'Book not found',
                statusCode  : 404
            }
        }
        for(const author of authorIds){
            const checkAuthor = await client.query(bookQueries.CHECK_AUTHOR, [author]);
            if(checkAuthor.rowCount === 0){
                await client.query("ROLLBACK");
                return {
                    data : null,
                    status : 'error',
                    statusCode : 404,
                    error : 'Author not found, enter correct author id'
                }
            }
        }
        await client.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
        for(const author of authorIds){
            await client.query(bookQueries.INSERT_BOOK_AUTHOR, [id, author]);
        }
        await client.query("COMMIT");
        const returnBook = await client.query(bookQueries.SELECT_ID,[id]);
        return {
            status : 'success',
            statusCode : 200,
            data : returnBook.rows[0],
            error : null
        }
    } catch (error) {
        console.log(error);
        return {
            status : 'error',
            statusCode : 500,
            data : null,
            error : 'Server error, could not update book'
        }
    }
}

export const deleteBook = async (id : string) : Promise<ServiceReturn<null>> => {
    // try {
    //     const {id} = req.params;
    //     await pool.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
    //     const deletedBook = await pool.query(bookQueries.DELETE, [id]);
    //     if(deletedBook.rowCount === 0){
    //         res.status(404).json({status : "error", data : null, error : `Book with id : ${id} not found`});
    //         return;
    //     }
    //     res.status(200).json({status: "successfully deleted book", data: deletedBook.rows, error: null});
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({status : "error", error : "Server error, could not delete book", data : null});
    // }
    try {
        const returnBook = await pool.query(bookQueries.SELECT_ID, [id]);
        if(returnBook.rowCount === 0){
            return {
                status : 'error',
                statusCode : 404,
                error : 'Incorrect Book Id, Please enter correct book Id',
                data : null
            }
        }
        await pool.query(bookQueries.DELETE_BOOK_AUTHOR, [id]);
        await pool.query(bookQueries.DELETE, [id]);
        return {
            status : 'success',
            statusCode : 200,
            data : null,
            error : null
        }
    } catch (error) {
        console.log(error);
        return {
            status : 'error',
            statusCode : 500,
            data : null,
            error : 'Server error, could not delete book'
        }
    }
}