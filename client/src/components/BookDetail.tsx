import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Paper,
  Typography,
  Button,
  Alert,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { bookService, Book } from '../services/bookService'

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchBook(id)
    }
  }, [id])

  const fetchBook = async (bookId: string) => {
    try {
      setLoading(true)
      const bookData = await bookService.getBookById(bookId)
      setBook(bookData)
      setError(null)
    } catch (err) {
      setError('Failed to fetch book details')
      console.error('Error fetching book:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Books
        </Button>
      </Paper>
    )
  }

  if (!book) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Book not found</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Books
        </Button>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Typography variant="h4" component="h1">
          {book.title}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/edit-book/${book._id || book.id || book.book_id}`)}
            startIcon={<Edit />}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
              Authors
            </Typography>
            <Typography variant="h6">
              {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
            </Typography>
          </Box>
        </Grid>



        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
              Published Year
            </Typography>
            <Typography variant="body1">
              {book.published_year}
            </Typography>
          </Box>
        </Grid>


      </Grid>
    </Paper>
  )
}

export default BookDetail