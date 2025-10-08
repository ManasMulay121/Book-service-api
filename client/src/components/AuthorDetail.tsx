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
import { authorService, Author } from '../services/authorService'

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchAuthor(id)
    }
  }, [id])

  const fetchAuthor = async (authorId: string) => {
    try {
      setLoading(true)
      const authorData = await authorService.getAuthorById(authorId)
      setAuthor(authorData)
      setError(null)
    } catch (err) {
      setError('Failed to fetch author details')
      console.error('Error fetching author:', err)
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
          onClick={() => navigate('/authors')}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Authors
        </Button>
      </Paper>
    )
  }

  if (!author) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Author not found</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/authors')}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Authors
        </Button>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Typography variant="h4" component="h1">
          {author.name}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => navigate('/authors')}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/edit-author/${author._id}`)}
            startIcon={<Edit />}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {author.bio && (
          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" gutterBottom>
                Biography
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {author.bio}
              </Typography>
            </Box>
          </Grid>
        )}

        {author.created_at && (
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                Added on
              </Typography>
              <Typography variant="body1">
                {new Date(author.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Grid>
        )}

        {author.updated_at && author.updated_at !== author.created_at && (
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                Last updated
              </Typography>
              <Typography variant="body1">
                {new Date(author.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default AuthorDetail