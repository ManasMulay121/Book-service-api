import axios from 'axios'
import { authService } from './auth.service'

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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

// Add request interceptor to include JWT token for protected routes
api.interceptors.request.use((config) => {
  // Add JWT token for protected routes (POST, PUT, DELETE)
  if (config.method && ['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
    const authHeaders = authService.getAuthHeaders();
    Object.entries(authHeaders).forEach(([key, value]) => {
      config.headers.set(key, value);
    });
  }
  return config;
});

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