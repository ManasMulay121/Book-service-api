CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE author (
    author_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
);

CREATE TABLE book (
    book_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    published_year INT,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
);

CREATE TABLE book_author (
    book_id UUID REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE,
    author_id UUID REFERENCES author(author_id) ON UPDATE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE users (
    username VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password_hash) 
values (
    'User_12093',
    '$2b$10$kAh24xkV3o.IcfoOcInhtOA/J2gk2WVrLH.ggWKHGnUhOfWmMnwQC'
)