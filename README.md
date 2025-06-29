# Book Service API

An API service for managing books and authors built with TypeScript, Express.js, and JSON file storage.

## 📚 Overview

This API provides comprehensive CRUD operations for managing a library system with books and authors. It uses JSON files for data persistence, making it lightweight and easy to set up for development and learning purposes.

## 🚀 Features

- **Authors Management**: Create, read, update, and delete authors
- **Books Management**: Create, read, update, and delete books
- **Relationship Mapping**: Books can have multiple authors via author IDs
- **TypeScript**: Full type safety and modern JavaScript features
- **File-based Storage**: Simple JSON file storage for data persistence
- **Auto ID Generation**: Automatic ID assignment for new entities
- **Error Handling**: Proper HTTP status codes and error messages

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Development**: Nodemon
- **Data Storage**: JSON files

## 📁 Project Structure

```
bookServiceAPI/
├── src/
│   ├── controllers/
│   │   ├── authorsController.ts    # Author CRUD operations
│   │   └── booksController.ts      # Book CRUD operations
│   ├── data/
│   │   ├── author.json            # Authors data storage
│   │   └── books.json             # Books data storage
│   ├── models/
│   │   ├── author.ts              # Author interface
│   │   └── book.ts                # Book interface
│   ├── routes/
│   │   ├── authorsRoutes.ts       # Author API routes
│   │   └── booksRoutes.ts         # Book API routes
│   ├── utils/
│   │   └── fileUtils.ts           # File read/write utilities
│   └── index.ts                   # Application entry point
├── .env                           # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookServiceAPI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Server will start on port 7999**
   ```
   Listening on port 7999
   API endpoints:
   - Authors: http://localhost:7999/authors
   - Books: http://localhost:7999/books
   ```

## 📡 API Endpoints

### Authors API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/authors` | Get all authors |
| GET | `/authors/:id` | Get author by ID |
| POST | `/authors` | Create new author |
| PUT | `/authors/:id` | Update author |
| DELETE | `/authors/:id` | Delete author |

### Books API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get book by ID |
| POST | `/books` | Create new book |
| PUT | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book |

## 🧪 API Usage Examples

### Authors

**Create Author**
```bash
POST http://localhost:7999/authors
Content-Type: application/json

{
  "name": "J.K. Rowling",
  "bio": "British author best known for the Harry Potter fantasy series"
}
```

**Get All Authors**
```bash
GET http://localhost:7999/authors
```

**Update Author**
```bash
PUT http://localhost:7999/authors/1
Content-Type: application/json

{
  "name": "Joanne Rowling",
  "bio": "Updated biography"
}
```

**Delete Author**
```bash
DELETE http://localhost:7999/authors/1
```

### Books

**Create Book**
```bash
POST http://localhost:7999/books
Content-Type: application/json

{
  "title": "Harry Potter and the Philosopher's Stone",
  "publishedYear": 1997,
  "authorIds": [1]
}
```

**Get All Books**
```bash
GET http://localhost:7999/books
```

**Update Book**
```bash
PUT http://localhost:7999/books/1
Content-Type: application/json

{
  "title": "Updated Book Title",
  "publishedYear": 1998
}
```

**Delete Book**
```bash
DELETE http://localhost:7999/books/1
```

## 🧩 Data Models

### Author
```typescript
interface Author {
  _id: number;
  name: string;
  bio?: string;
}
```

### Book
```typescript
interface Book {
  _id: number;
  title: string;
  authorIds: number[];
  publishedYear: number;
}
```

## 🧪 Testing with Postman

1. **Import Collection**: Create a new Postman collection for the API
2. **Set Base URL**: `http://localhost:7999`
3. **Test Authors**: Start by creating authors first
4. **Test Books**: Create books using the author IDs from step 3
5. **Test CRUD**: Try all operations (Create, Read, Update, Delete)

### Sample Test Data

**Sample Authors:**
```json
[
  {
    "name": "J.K. Rowling",
    "bio": "British author of Harry Potter series"
  },
  {
    "name": "Agatha Christie",
    "bio": "English detective novelist"
  }
]
```

**Sample Books:**
```json
[
  {
    "title": "Harry Potter and the Philosopher's Stone",
    "publishedYear": 1997,
    "authorIds": [1]
  },
  {
    "title": "1984",
    "publishedYear": 1949,
    "authorIds": [2]
  },
]
```

## 📝 Available Scripts

```bash
# Start development server with auto-reload
npm run start

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=7999
```

### TypeScript Configuration

The project uses standard TypeScript configuration with:
- Target: ES2016
- Module: CommonJS
- Strict mode enabled
- Output directory: `./dist`

## 🚀 Deployment

For production deployment:

1. **Build the project**
   ```bash
   npx tsc
   ```

2. **Start the production server**
   ```bash
   node dist/index.js
   ```

## 👨‍💻 Author

Built with ❤️ for learning Node.js, TypeScript, and REST API development.

---

**Happy Coding! 🚀**