export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Store token in localStorage
const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('streamflow_token', token);
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('streamflow_token');
  }
  return null;
};

// Remove token from localStorage
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('streamflow_token');
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('streamflow_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Store user in localStorage
const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('streamflow_user', JSON.stringify(user));
  }
};

// Remove user from localStorage
const removeCurrentUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('streamflow_user');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Login user
export async function login(email: string, password: string, onSuccess?: (user: User) => void): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    setToken(data.token);
    setCurrentUser(data.user);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess(data.user);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Signup user
export async function signup(username: string, email: string, password: string, onSuccess?: (user: User) => void): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    setToken(data.token);
    setCurrentUser(data.user);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess(data.user);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Logout user
export const logout = () => {
  removeToken();
  removeCurrentUser();
  
  // Redirect to home page
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// Verify token with backend
export async function verifyToken(): Promise<User | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Token is invalid, remove it
      logout();
      return null;
    }

    const data = await response.json();
    setCurrentUser(data.user);
    return data.user;
  } catch (error) {
    console.error('Token verification failed:', error);
    logout();
    return null;
  }
}

// Get user profile
export async function getUserProfile(): Promise<User | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return null;
      }
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    setCurrentUser(data.user);
    return data.user;
  } catch (error) {
    console.error('Profile fetch failed:', error);
    return null;
  }
}

// Google OAuth login
export const googleLogin = () => {
  const googleAuthUrl = `${API_BASE_URL}/auth/google`;
  window.location.href = googleAuthUrl;
};

// Handle OAuth callback
export const handleOAuthCallback = (token: string) => {
  setToken(token);
  
  // Fetch user profile
  getUserProfile().then(() => {
    // Redirect to home page after successful OAuth
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  });
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend verification email');
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Failed to resend verification email' };
  }
};

// Delete account
export const deleteAccount = async (password: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete account');
    }

    // Clear local storage
    removeToken();
    removeCurrentUser();

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete account' };
  }
}; 