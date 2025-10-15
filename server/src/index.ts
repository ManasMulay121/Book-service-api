import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authorsRoutes from './routes/authorsRoutes';
import booksRoutes from './routes/booksRoutes';
import { auth } from './Middleware/authMiddleware';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Test auth endpoint
app.get('/test-auth', auth, (req, res) => {
  res.json({
    status: 'success',
    message: 'Authentication successful',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- Authors: http://localhost:${PORT}/authors`);
  console.log(`- Books: http://localhost:${PORT}/books`);
});
