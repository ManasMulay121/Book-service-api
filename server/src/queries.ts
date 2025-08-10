export const authorQueries = {
    SELECT_ALL: `SELECT * FROM author`,
    SELECT_ID: `SELECT * FROM author WHERE author_id = $1`,
    CREATE: `INSERT INTO author(name, bio, created_at, updated_at) VALUES ($1, $2, $3::DATE, $3::DATE) RETURNING *`,
    UPDATE: `UPDATE author SET name = $1, bio = $2, updated_at = $3::DATE WHERE author_id = $4 RETURNING *`,
    DELETE: `DELETE FROM author a WHERE a.author_id = $1 RETURNING *`,
    COUNT: `SELECT COUNT(*) FROM author`
};

export const bookQueries = {
    SELECT_ALL: `SELECT 
        b.book_id, 
        b.title, 
        b.published_year, 
        b.created_at,
        b.updated_at,
        json_agg(json_build_object('author_id', a.author_id, 
                    'name', a.name,
                    'bio', a.bio,
                    'author_created', a.created_at,
                    'author_updated', a.updated_at)) AS authors
    FROM book b
    JOIN book_author ba on ba.book_id = b.book_id
    JOIN author a on a.author_id = ba.author_id
    GROUP BY b.book_id, b.title, b.published_year, b.created_at::DATE, b.updated_at::DATE;`,
    SELECT_ID: `SELECT 
        b.book_id, 
        b.title, 
        b.published_year, 
        b.created_at,
        b.updated_at,
        json_agg(json_build_object('author_id', a.author_id, 
                    'name', a.name,
                    'bio', a.bio,
                    'author_created', a.created_at,
                    'author_updated', a.updated_at)) AS authors
    FROM book b
    JOIN book_author ba on ba.book_id = b.book_id
    JOIN author a on a.author_id = ba.author_id
    WHERE b.book_id = $1
    GROUP BY b.book_id, b.title, b.published_year, b.created_at, b.updated_at;`,
    CREATE: `INSERT INTO book(title, published_year, created_at, updated_at) VALUES ($1, $2, $3::DATE, $3::DATE) RETURNING *`,
    UPDATE: `UPDATE book SET title = $1, published_year = $2, updated_at = $3::DATE WHERE book_id = $4`,
    DELETE_BOOK_AUTHOR: `DELETE FROM book_author ba WHERE ba.book_id = $1`,
    DELETE: `DELETE FROM book WHERE book_id = $1`,
    CHECK_AUTHOR: `SELECT * FROM author WHERE author_id = $1`,
    INSERT_BOOK_AUTHOR: `INSERT INTO book_author(book_id, author_id) VALUES ($1, $2)`
};