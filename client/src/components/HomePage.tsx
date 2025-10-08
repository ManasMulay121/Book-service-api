import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Card, Grid, Button } from '@mui/material'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleBooksClick = () => {
    navigate('/books')
  }

  const handleAuthorsClick = () => {
    navigate('/authors')
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#1976d2',
            mb: 4
          }}
        >
          Book Service API
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            maxWidth: 600
          }}
        >
          Welcome to your digital library management system
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: '#1976d2' }}>
                📚
              </Typography>
              <Typography variant="h5" gutterBottom>
                Books
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Manage your book collection
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ backgroundColor: '#1976d2' }}
                onClick={handleBooksClick}
              >
                View Books
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: '#dc004e' }}>
                👥
              </Typography>
              <Typography variant="h5" gutterBottom>
                Authors
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Manage author profiles
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ backgroundColor: '#dc004e' }}
                onClick={handleAuthorsClick}
              >
                View Authors
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default HomePage