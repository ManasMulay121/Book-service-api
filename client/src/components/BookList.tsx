import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  // Paper,
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
  const [error, setError] = useState<string | null>(null)
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
      console.log('Fetched books:', data) // Debug log
      console.log('Books array length:', data?.length)
      
      // Log individual book structures
      if (Array.isArray(data) && data.length > 0) {
        console.log('First book structure:', data[0])
        console.log('First book authors field:', data[0].authors, 'type:', typeof data[0].authors)
      }
      
      // Ensure we always have an array
      const booksArray = Array.isArray(data) ? data : []
      setBooks(booksArray)
      setError(null)
      console.log('Books state after update should be:', booksArray)
    } catch (err) {
      console.error('Error fetching books:', err)
      setError(`Failed to fetch books: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
        setError('Failed to delete book')
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
        console.log('Authors cell data:', authors, 'type:', typeof authors)
        
        if (Array.isArray(authors)) {
          // Handle array of author objects or strings
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
          // Handle single author object
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-book')}
        >
          Add New Book
        </Button>
      </Box>
      {error && (
        <Box mb={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={Array.isArray(books) ? books : []}
          columns={columns}
          getRowId={(row) => row._id || row.id || row.book_id}
          hideFooter={true}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      </div>
    </div>
  )
}

export default BookList