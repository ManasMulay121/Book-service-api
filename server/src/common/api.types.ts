// Common API response type following Jayant's recommendations
export interface APIResponse<T> {
  status: 'success' | 'error';
  data: T | null;
  error: string | null;
}

// Auth-related types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  password_hash?: string; // Optional for responses
}

export interface LoginResponseData {
  token: string;
  user: User;
}
