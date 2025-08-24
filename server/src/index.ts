import express from 'express'
import dotenv from 'dotenv'
import authorsRoutes from './routes/authorsRoutes'
import booksRoutes from './routes/booksRoutes'

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

// Routes
app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);


const PORT : number = parseInt(process.env.PORT as string, 10);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`API endpoints:`);
    console.log(`- Authors: http://localhost:${PORT}/authors`);
    console.log(`- Books: http://localhost:${PORT}/books`);
})