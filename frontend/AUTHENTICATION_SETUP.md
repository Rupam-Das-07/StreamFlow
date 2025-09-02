# StreamFlow Authentication Setup Guide

This guide will help you set up authentication for the StreamFlow music streaming application with both Google OAuth and email/password login.

## Features

- ✅ Email/Password Registration and Login
- ✅ Google OAuth Authentication
- ✅ JWT Token-based Authentication
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ MongoDB Database Integration

## Prerequisites

1. **MongoDB**: Install and run MongoDB locally or use MongoDB Atlas
2. **Node.js**: Version 16 or higher
3. **Google OAuth**: Google Cloud Console setup (optional)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/streamflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Authorized redirect URIs to: `http://localhost:4000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### 4. Start the Backend

```bash
npm run dev
```

## API Endpoints

### Authentication Endpoints

#### Register with Email/Password
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login with Email/Password
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Google OAuth
```
GET /api/auth/google
```
This will redirect to Google OAuth and then back to your frontend.

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "username": "new_username",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
```

### Songs Endpoints

#### Get All Songs (Public)
```
GET /api/songs
```

#### Get Song by ID (Public)
```
GET /api/songs/:id
```

#### Search Songs (Public)
```
GET /api/songs/search/:query
```

#### Add New Song (Protected)
```
POST /api/songs
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": "3:45",
  "url": "https://example.com/song.mp3",
  "cover": "https://example.com/cover.jpg"
}
```

#### Like a Song (Protected)
```
POST /api/songs/:id/like
Authorization: Bearer <your-jwt-token>
```

#### Get User Favorites (Protected)
```
GET /api/songs/user/favorites
Authorization: Bearer <your-jwt-token>
```

#### Get Recently Played (Protected)
```
GET /api/songs/user/recent
Authorization: Bearer <your-jwt-token>
```

## Frontend Integration

### 1. Authentication Context

Create an authentication context to manage user state:

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const googleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetch('http://localhost:4000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUser(data.user))
        .catch(() => logout());
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Login Component

```typescript
// components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={googleLogin}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};
```

### 3. Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

## Testing the Authentication

### 1. Test Registration

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Make sure MongoDB is running locally or update the MONGODB_URI in your .env file.

2. **Google OAuth Error**: Ensure your Google OAuth credentials are correctly configured and the redirect URI matches.

3. **CORS Error**: The backend is configured to allow requests from `http://localhost:3000`. Update the FRONTEND_URL in your .env if needed.

4. **JWT Token Error**: Make sure the JWT_SECRET is set in your .env file.

### Security Notes

- Change the default JWT_SECRET and SESSION_SECRET in production
- Use HTTPS in production
- Implement rate limiting for authentication endpoints
- Add email verification for better security
- Consider implementing refresh tokens

## Next Steps

1. Implement email verification
2. Add password reset functionality
3. Implement refresh tokens
4. Add social login providers (Facebook, Twitter, etc.)
5. Implement user roles and permissions
6. Add audit logging for security events
