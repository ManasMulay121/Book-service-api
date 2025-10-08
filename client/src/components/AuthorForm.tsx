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
} from '@mui/material'
import { authorService, Author } from '../services/authorService'

const AuthorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState<Omit<Author, '_id' | 'created_at' | 'updated_at'>>({
    name: '',
    bio: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      fetchAuthor(id)
    }
  }, [id, isEdit])

  const fetchAuthor = async (authorId: string) => {
    try {
      setLoading(true)
      const author = await authorService.getAuthorById(authorId)
      setFormData({
        name: author.name,
        bio: author.bio || '',
      })
    } catch (err) {
      setError('Failed to fetch author details')
      console.error('Error fetching author:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isEdit && id) {
        await authorService.updateAuthor(id, formData)
        setSuccess('Author updated successfully!')
      } else {
        await authorService.createAuthor(formData)
        setSuccess('Author created successfully!')
      }

      setTimeout(() => {
        navigate('/authors')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save author')
      console.error('Error saving author:', err)
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
        {isEdit ? 'Edit Author' : 'Add New Author'}
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
              name="name"
              label="Author Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="bio"
              label="Biography"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Tell us about this author..."
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/authors')}
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

export default AuthorForm