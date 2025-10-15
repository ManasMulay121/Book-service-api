import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  CircularProgress,
  Autocomplete,
  Chip,
} from '@mui/material'
import { bookService, Book, BookApiRequest } from '../services/bookService'
import { authorService, Author } from '../services/authorService'

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState<Omit<Book, '_id'>>({
    title: '',
    authors: [],
    published_year: 0, // Initialize with 0 instead of current year
  })

  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchAuthors()
    if (isEdit && id) {
      fetchBook(id)
    }
  }, [id, isEdit])

  const fetchAuthors = async () => {
    try {
      const authors = await authorService.getAllAuthors()
      setAvailableAuthors(authors)
    } catch (err) {
      console.error('Error fetching authors:', err)
    }
  }

  const fetchBook = async (bookId: string) => {
    try {
      setLoading(true)
      const book = await bookService.getBookById(bookId)
      
      // Convert author IDs to author names for the UI
      const authorNames = book.authors.map(authorId => {
        const author = availableAuthors.find(a => 
          (a.author_id && a.author_id === authorId) || 
          (a.id && a.id === authorId) || 
          (a._id && a._id === authorId)
        )
        return author ? author.name : authorId
      })
      
      setFormData({
        title: book.title,
        authors: book.authors, // Keep IDs for backend
        published_year: book.published_year,
      })
      setSelectedAuthors(authorNames) // Show names in UI
    } catch (err) {
      console.error('Error fetching book:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'published_year') {
      // Convert to number if possible, otherwise use 0
      const numValue = value === '' ? 0 : parseInt(value) || 0
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAuthorsChange = (_event: any, newValue: string[]) => {
    setSelectedAuthors(newValue)
    
    // Convert author names to author IDs
    const authorIds = newValue
      .map(authorName => {
        const author = availableAuthors.find(a => a.name === authorName)
        return author ? (author.author_id || author.id || author._id) : undefined
      })
      .filter((id): id is string => typeof id === 'string')
    
    console.log('Selected author names:', newValue)
    console.log('Converted to author IDs:', authorIds)
    
    setFormData(prev => ({
      ...prev,
      authors: authorIds,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validate that we have author IDs
    if (!formData.authors || formData.authors.length === 0) {
      setError('Please select at least one author')
      setLoading(false)
      return
    }

    // Ensure authors is an array of strings and format for backend
    const authorIds = Array.isArray(formData.authors) ? formData.authors.filter(id => typeof id === 'string') : []
    
    const cleanFormData: BookApiRequest = {
      title: formData.title,
      authorIds: authorIds,
      published_year: formData.published_year
    }

    console.log('Original form data:', formData)
    console.log('Cleaned form data:', cleanFormData)
    console.log('Authors array type:', typeof cleanFormData.authorIds, 'Is array:', Array.isArray(cleanFormData.authorIds))
    console.log('Authors array content:', cleanFormData.authorIds)
    console.log('Individual author IDs:')
    cleanFormData.authorIds.forEach((id, index) => console.log(`  [${index}]:`, typeof id, id))

    // Final validation - ensure we have a proper array of strings
    if (!Array.isArray(cleanFormData.authorIds) || cleanFormData.authorIds.length === 0) {
      setError('Invalid authors selection. Please refresh and try again.')
      setLoading(false)
      return
    }

    try {
      if (isEdit && id) {
        await bookService.updateBook(id, cleanFormData)
        setSuccess('Book updated successfully!')
      } else {
        await bookService.createBook(cleanFormData)
        setSuccess('Book created successfully!')
      }

      // Navigate to book list after successful operation
      setTimeout(() => {
        navigate('/books', { state: { refresh: true } })
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save book')
      console.error('Error saving book:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={availableAuthors.map(author => author.name)}
              value={selectedAuthors}
              onChange={handleAuthorsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Authors"
                  placeholder="Select or type author names"
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="published_year"
              label="Published Year"
              type="text"
              value={formData.published_year || ''}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              inputProps={{
                style: { 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default BookForm