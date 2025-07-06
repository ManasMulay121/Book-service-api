# Book Service API

A RESTful API for managing books and authors built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **Authors Management**: Create, read, update authors
- **Books Management**: Create, read, update books, delete books
- **Database**: PostgreSQL with UUID primary keys

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Tools**: Nodemon for development

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=8080
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Set up database**
   Run the SQL script in `src/database.sql` to create the required tables.

4. **Start development server**
   ```bash
   npm run serve
   ```

## API Endpoints

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author by ID
- `POST /authors` - Create new author
- `PUT /authors/:id` - Update author

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book

## Project Structure

```
src/
├── controllers/     # Route handlers
├── models/         # Data models
├── routes/         # API routes
├── database.sql    # Database schema
├── databasepg.ts   # Database connection
└── index.ts        # Application entry point
```

## Scripts

- `npm run serve` - Start development server with nodemon

## Usage Examples

**Create Author:**

```bash
POST http://localhost:8080/authors
Content-Type: application/json

{
  "name": "J.K. Rowling",
  "bio": "British author of Harry Potter series"
}
```

**Create Book:**

```bash
POST http://localhost:8080/books
Content-Type: application/json

{
  "title": "Harry Potter and the Philosopher's Stone",
  "publishedYear": 1997,
  "authorIds": ["550e8400-e29b-41d4-a716-446655440000", "6ba7b810-9dad-11d1-80b4-00c04fd430c8"]
}
```

## Data Models

```typescript
interface Author {
    author_id: string;  // UUID
    name: string;
    bio?: string;
}

interface Book {
    book_id: string;    // UUID
    title: string;
    author_ids: string[];  // Array of UUIDs
    published_year: number;
}
```

