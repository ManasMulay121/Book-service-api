import axios from 'axios'

export interface Book {
  _id?: string
  id?: string
  book_id?: string
  title: string
  authors: string[] // Array of author IDs (UUIDs) - for frontend state
  published_year: number
  created_at?: string
  updated_at?: string
}

// Separate interface for API calls
export interface BookApiRequest {
  title: string
  authorIds: string[] // Backend expects 'authorIds'
  published_year: number
}

const API_BASE_URL = window.location.origin + '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

export const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get(`/books?t=${Date.now()}`)
    console.log('Books API Response:', response.data) // Debug log
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data.books && Array.isArray(response.data.books)) {
      return response.data.books
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data
    } else {
      console.error('Unexpected books API response format:', response.data)
      return []
    }
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get(`/books/${id}`)
    return response.data
  },

  createBook: async (book: BookApiRequest): Promise<Book> => {
    const response = await api.post('/books', book)
    return response.data
  },

  updateBook: async (id: string, book: BookApiRequest): Promise<Book> => {
    const response = await api.put(`/books/${id}`, book)
    return response.data
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`)
  },
}