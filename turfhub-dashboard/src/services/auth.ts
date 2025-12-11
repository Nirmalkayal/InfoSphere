import adminApi from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  turfId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await adminApi.post('/login', credentials); // adminApi already has base URL, but wait, adminApi usually points to root or /admin?
    const { token, user } = response.data;

    // Store token and user in localStorage
    localStorage.setItem('turfhub_token', token);
    localStorage.setItem('turfhub_user', JSON.stringify(user));

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await adminApi.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('turfhub_token');
      localStorage.removeItem('turfhub_user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('turfhub_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('turfhub_token');
  },

  // Verify token validity
  verifyToken: async (): Promise<User> => {
    const response = await adminApi.get('/verify');
    return response.data.user;
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const response = await adminApi.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('turfhub_token', token);
    return token;
  },
};

export default authService;
