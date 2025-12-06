import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authorsRoutes from './modules/authors/authors.routes';
import booksRoutes from './modules/books/books.routes';
import authRoutes from './modules/auth/auth.routes';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- Authentication: http://localhost:${PORT}/auth`);
  console.log(`  - POST /auth/login - Login user and get JWT token`);
  console.log(`- Authors: http://localhost:${PORT}/authors`);
  console.log(`- Books: http://localhost:${PORT}/books`);
});
