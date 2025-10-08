import { Routes, Route, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import HomePage from './components/HomePage'
import BookList from './components/BookList'
import AuthorList from './components/AuthorList'
import BookForm from './components/BookForm'
import AuthorForm from './components/AuthorForm'
import BookDetail from './components/BookDetail'
import AuthorDetail from './components/AuthorDetail'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

const Navigation = () => {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/')
  }

  const handleBooksClick = () => {
    navigate('/books')
  }

  const handleAuthorsClick = () => {
    navigate('/authors')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={handleHomeClick}
        >
          Book Service API
        </Typography>
        <Button color="inherit" onClick={handleBooksClick}>
          BOOKS
        </Button>
        <Button color="inherit" onClick={handleAuthorsClick}>
          AUTHORS
        </Button>
      </Toolbar>
    </AppBar>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <Navigation />
           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/authors" element={<AuthorList />} />
            
            {/* Book CRUD Routes */}
            <Route path="/add-book" element={<BookForm />} />
            <Route path="/edit-book/:id" element={<BookForm />} />
            <Route path="/book/:id" element={<BookDetail />} />
            
            {/* Author CRUD Routes */}
            <Route path="/add-author" element={<AuthorForm />} />
            <Route path="/edit-author/:id" element={<AuthorForm />} />
            <Route path="/author/:id" element={<AuthorDetail />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App