import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Paper,
  Typography,
  Button,
  // Alert,
  CircularProgress,
  Box,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { authorService, Author } from '../services/authorService'

const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchAuthors()
    
    if (location.state?.refresh) {
      setTimeout(() => fetchAuthors(), 100)
    }
    
    // Refresh when window gains focus
    const handleFocus = () => {
      fetchAuthors()
    }
    
    // Refresh when navigating back to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAuthors()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [location.state])


  const fetchAuthors = async () => {
    try {
      setLoading(true)
      const data = await authorService.getAllAuthors()
      console.log('Fetched authors:', data) // Debug log
      console.log('Authors array length:', data?.length)
      console.log('Authors state before update:', authors)
      
      // Ensure we always have an array
      const authorsArray = Array.isArray(data) ? data : []
      setAuthors(authorsArray)
      setError(null)
      console.log('Authors state after update should be:', authorsArray)
    } catch (err) {
      console.error('Error fetching authors:', err)
      setError(`Failed to fetch authors: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setAuthors([]) // Ensure we have an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete author with ID:', id)
    
    if (!id || id === 'undefined') {
      setError('Invalid author ID - cannot delete')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await authorService.deleteAuthor(id)
        setAuthors(authors.filter(author => (author._id || author.id || author.author_id) !== id))
        setError(null) // Clear any previous errors on success
      } catch (err: any) {
        // Show the actual error message from the backend
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete author'
        setError(errorMessage)
        console.error('Error deleting author:', err)
        console.error('Error response:', err.response?.data)
      }
    }
  }


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading authors...</Typography>
      </Box>
    )
  }

  // Basic rendering test
  console.log('About to render AuthorList, error:', error, 'authors length:', authors.length)

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Authors List
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/add-author')}
          >
            Add New Author
          </Button>
        </Box>

        {/* Author cards with actions */}
        {authors.length > 0 ? (
          <div>
            {authors.map((author, index) => {
              const authorId = author._id || author.id || author.author_id
              console.log('Author object:', author, 'Using ID:', authorId)
              
              return (
                <Paper key={authorId || index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        <strong>{author.name}</strong>
                      </Typography>

                      {author.bio && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {author.bio}
                        </Typography>
                      )}
                      {author.created_at && (
                        <Typography variant="caption" color="text.secondary">
                          Added: {new Date(author.created_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={1} ml={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/edit-author/${authorId}`)}
                        disabled={!authorId}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(authorId!)}
                        disabled={!authorId}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </div>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No authors found. Try adding one!
          </Typography>
        )}
      </Paper>
    </div>
  )
}

export default AuthorList