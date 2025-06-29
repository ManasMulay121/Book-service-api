# Book Service API

A REST API for managing books and authors built with TypeScript, Express.js, and JSON file storage.

## 🚀 Features

- **CRUD Operations**: Complete Create, Read, Update, Delete for books and authors
- **TypeScript**: Full type safety and modern JavaScript features
- **JSON Storage**: Simple file-based data persistence
- **Express.js**: Fast and lightweight web framework

## 🛠️ Tech Stack

**Node.js** • **TypeScript** • **Express.js** • **JSON Files**

## ⚡ Quick Start

```bash
# Clone and install
git clone https://github.com/ManasMulay121/Book-service-api.git
cd bookServiceAPI
npm install

# Start development server
npm run dev
```

Server runs on: **http://localhost:7999**

## 📡 API Endpoints

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author by ID
- `POST /authors` - Create new author
- `PUT /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

## 💡 Usage Example

**Create Author:**
```bash
POST http://localhost:7999/authors
Content-Type: application/json

{
  "name": "J.K. Rowling",
  "bio": "British author of Harry Potter series"
}
```

**Create Book:**
```bash
POST http://localhost:7999/books
Content-Type: application/json

{
  "title": "Harry Potter and the Philosopher's Stone",
  "publishedYear": 1997,
  "authorIds": [1]
}
```

## 🗂️ Data Models

```typescript
interface Author {
  _id: number;
  name: string;
  bio?: string;
}

interface Book {
  _id: number;
  title: string;
  authorIds: number[];
  publishedYear: number;
}
```

---

Built with ❤️ for learning Node.js, TypeScript, and REST API development.