import pool from '../databasepg';
import { authorQueries } from '../queries';
import { ServiceReturn } from '../models/ServiceResult';
import { author } from '../models/authors';

export const getAuthors = async (): Promise<ServiceReturn<author[]>> => {
    try {
        const authors = await pool.query(authorQueries.SELECT_ALL);
        if (authors.rowCount === 0) {
            return {
                status: "error",
                data: null,
                error: "No authors found",
                statusCode : 404
            };
        }
        return {
            status: "success",
            data: authors.rows,
            error : null,
            statusCode : 200
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            data: null,
            error: "Server error, could not fetch authors",
            statusCode : 500
        };
    }
};

export const getAuthorById = async (id: string): Promise<ServiceReturn<author>> => {
    try {
        const result = await pool.query(authorQueries.SELECT_ID, [id]);
        if (result.rowCount === 0) {
            return {
                status: "error",
                data: null,
                error: `Author with id ${id} not found`,
                statusCode : 404
            };
        }
        return {
            status: "success",
            data: result.rows[0],
            error : null,
            statusCode : 200
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            data: null,
            error: "Server error, could not fetch author",
            statusCode : 500
        };
    }
};

export const createAuthor = async (name: string, bio: string, utcTimeString: string): Promise<ServiceReturn<author>> => {
    try {
        const yyyyMMdd: string = new Date(utcTimeString).toISOString().slice(0, 10);
        const result = await pool.query(authorQueries.CREATE, [name, bio, yyyyMMdd]);
        return {
            status: "success",
            data: result.rows[0],
            error : null,
            statusCode: 201
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            data: null,
            error: "Server error, could not create author",
            statusCode : 500
        };
    }
};

export const updateAuthor = async (id: string, name: string, bio: string, utcTimeString: string): Promise<ServiceReturn<author>> => {
    try {
        const yyyyMMdd: string = new Date(utcTimeString).toISOString().slice(0, 10);
        const result = await pool.query(authorQueries.UPDATE, [name, bio, yyyyMMdd, id]);
        if (result.rowCount === 0) {
            return {
                status: "error",
                data: null,
                error: `Author with id ${id} not found`,
                statusCode : 404
            };
        }
        return {
            status: "success",
            data: result.rows[0],
            error : null,
            statusCode : 200
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            data: null,
            error: "Server error, could not update author",
            statusCode : 500
        };
    }
};

export const deleteAuthor = async (id: string): Promise<ServiceReturn<author>> => {
    try {
        const count_author = await pool.query(authorQueries.COUNT);
        if (Number(count_author.rows[0].count) === 1) {
            return {
                status: "error",
                data: null,
                error: "At least one author required, cannot delete",
                statusCode : 403
            };
        }
        const result = await pool.query(authorQueries.DELETE, [id]);
        if (result.rowCount === 0) {
            return {
                status: "error",
                data: null,
                error: "Author not found, enter correct author_id",
                statusCode : 404
            };
        }
        return {
            status: "success",
            data: result.rows[0],
            error : null,
            statusCode : 200
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            data: null,
            error: "Server error, could not delete author",
            statusCode : 500
        };
    }
};


// import pool from '../databasepg';
// import { authorQueries } from '../queries';
// import { ServiceReturn } from '../models/ServiceResult';
// import { author } from '../models/authors';

// export const getAuthors = async () : Promise<ServiceReturn<author[]>> => {
//     try {
//         const authors = await pool.query(authorQueries.SELECT_ALL);
//         if(authors.rowCount === 0){
//             return {
//                 data : null,
//                 status : 'error',
//                 error : 'Authors not found, add them first'
//             }
//         }
//         return {
//             data : authors.rows,
//             status : 'success',
//             error : ''
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             data : null,
//             status : 'error',
//             error : 'Server error, could not fetch authors'
//         }
//     }
// };

// export const getAuthorById = async (id: string) : => {
//     try {
//         const author = await pool.query(authorQueries.SELECT_ID, [id]);
//         return author.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// export const createAuthor = async (name: string, bio: string, utcTimeString: string) => {
//     try {
//         const yyyyMMdd: string = new Date(utcTimeString).toISOString().slice(0, 10);
//         const addAuthor = await pool.query(authorQueries.CREATE, [name, bio, yyyyMMdd]);
//         return addAuthor.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// export const updateAuthor = async (id: string, name: string, bio: string, utcTimeString: string) => {
//     try {
//         const yyyyMMdd: string = new Date(utcTimeString).toISOString().slice(0, 10);
//         const updatedAuthor = await pool.query(authorQueries.UPDATE, [name, bio, yyyyMMdd, id]);
//         return updatedAuthor;
//     } catch (error) {
//         throw error;
//     }
// };

// export const deleteAuthor = async (id: string) => {
//     try {
//         const count_author = await pool.query(authorQueries.COUNT);
//         if (Number(count_author.rows[0].count) === 1) {
//             return { error: 'Atleast one author required, cannot delete', code: 403 };
//         }
//         const deletedAuthor = await pool.query(authorQueries.DELETE, [id]);
//         return deletedAuthor;
//     } catch (error) {
//         throw error;
//     }
// };

