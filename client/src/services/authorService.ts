import axios from 'axios'

export interface Author {
  _id?: string
  id?: string
  author_id?: string
  name: string
  bio?: string
  created_at?: string
  updated_at?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
console.log('API Base URL:', API_BASE_URL)
console.log('API Key:', import.meta.env.VITE_API_KEY)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

export const authorService = {
  getAllAuthors: async (): Promise<Author[]> => {
    const response = await api.get(`/authors?t=${Date.now()}`)
    console.log('API Response:', response.data) // Debug log
    
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data.authors && Array.isArray(response.data.authors)) {
      return response.data.authors
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data
    } else {
      console.error('Unexpected API response format:', response.data)
      return []
    }
  },

  getAuthorById: async (id: string): Promise<Author> => {
    const response = await api.get(`/authors/${id}`)
    return response.data
  },

  createAuthor: async (author: Omit<Author, '_id' | 'created_at' | 'updated_at'>): Promise<Author> => {
    try {
      console.log('Creating author with data:', author);
      console.log('Using API key:', import.meta.env.VITE_API_KEY);
      console.log('API URL:', API_BASE_URL);
      
      const response = await api.post('/authors', author);
      console.log('Author created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating author:', error.response?.data || error.message);
      throw error;
    }
  },

  updateAuthor: async (id: string, author: Omit<Author, '_id' | 'created_at' | 'updated_at'>): Promise<Author> => {
    const response = await api.put(`/authors/${id}`, author)
    return response.data
  },

  deleteAuthor: async (id: string): Promise<void> => {
    await api.delete(`/authors/${id}`)
  },
}