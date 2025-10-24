import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import HomePage from './components/HomePage'
import BookList from './components/book.list'
import AuthorList from './components/author.list'
import BookForm from './components/book.form'
import AuthorForm from './components/author.form'
import BookDetail from './components/book.detail'
import AuthorDetail from './components/author.detail'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/protected.route'
import LoginForm from './components/login.form'
import { authService } from './services/auth.service'

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
    }
    
    checkAuth()
  }, [])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          Loading...
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* If not authenticated, redirect to login */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
            } />
            
            {/* If not authenticated, redirect all routes to login */}
            <Route path="/" element={
              isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
            } />
            <Route path="/books" element={
              isAuthenticated ? <BookList /> : <Navigate to="/login" replace />
            } />
            <Route path="/authors" element={
              isAuthenticated ? <AuthorList /> : <Navigate to="/login" replace />
            } />
            
            {/* Protected Book CRUD Routes */}
            <Route path="/add-book" element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } />
            <Route path="/edit-book/:id" element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } />
            <Route path="/book/:id" element={
              isAuthenticated ? <BookDetail /> : <Navigate to="/login" replace />
            } />

            {/* Protected Author CRUD Routes */}
            <Route path="/add-author" element={
              <ProtectedRoute>
                <AuthorForm />
              </ProtectedRoute>
            } />
            <Route path="/edit-author/:id" element={
              <ProtectedRoute>
                <AuthorForm />
              </ProtectedRoute>
            } />
            <Route path="/author/:id" element={
              isAuthenticated ? <AuthorDetail /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App