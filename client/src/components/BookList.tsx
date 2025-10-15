import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { Edit, Delete } from '@mui/icons-material'
import { bookService, Book } from '../services/bookService'

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBooks()
    
    // Refresh when window gains focus
    const handleFocus = () => {
      fetchBooks()
    }
    
    // Refresh when navigating back to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBooks()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await bookService.getAllBooks()
      
      // Ensure we always have an array
      const booksArray = Array.isArray(data) ? data : []
      setBooks(booksArray)
    } catch (err) {
      console.error('Error fetching books:', err)
      setBooks([]) // Ensure we have an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id)
        setBooks(books.filter(book => book._id !== id))
      } catch (err) {
        console.error('Error deleting book:', err)
      }
    }
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200, sortable: false, filterable: false },
    { 
      field: 'authors', 
      headerName: 'Authors', 
      flex: 1, 
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const authors = params.value
        
        if (Array.isArray(authors)) {
          return authors.map(author => {
            if (typeof author === 'string') {
              return author
            } else if (author && typeof author === 'object' && author.name) {
              return author.name
            } else if (author && typeof author === 'object') {
              return author.author_name || author.title || 'Unknown Author'
            }
            return String(author)
          }).join(', ')
        } else if (typeof authors === 'string') {
          return authors
        } else if (authors && typeof authors === 'object' && authors.name) {
          return authors.name
        } else if (authors && typeof authors === 'object') {
          return authors.author_name || authors.title || JSON.stringify(authors)
        }
        return 'No authors'
      },
    },
    {
      field: 'published_year',
      headerName: 'Published Year',
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/edit-book/${params.id}`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Books
        </Typography>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        {books.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No books found
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Try adding a new book
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/add-book')}
              sx={{ mt: 2 }}
            >
              Add New Book
            </Button>
          </Box>
        ) : (
          <DataGrid
            rows={books}
            columns={columns}
            getRowId={(row) => row._id || row.id || row.book_id}
            hideFooter={true}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        )}
      </div>
    </div>
  )
}

export default BookList
