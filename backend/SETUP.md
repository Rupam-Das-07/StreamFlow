# Backend Authentication Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/streamflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# YouTube API Configuration
YOUTUBE_API_KEY=your-youtube-api-key

# Jamendo Music API Configuration
JAMENDO_CLIENT_ID=your-jamendo-client-id
```

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. MongoDB Setup

- Install MongoDB locally or use MongoDB Atlas
- Create a database named `streamflow`
- Update `MONGODB_URI` in your `.env` file

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set Application Type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:4000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
7. Copy Client ID and Client Secret to your `.env` file

### 4. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API key
4. Copy API key to your `.env` file

### 5. Jamendo API Setup (Optional)

1. Go to [Jamendo Developer Portal](https://developer.jamendo.com/)
2. Create account and get Client ID
3. Copy Client ID to your `.env` file

## Running the Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify` - Verify JWT token

### Music/Songs

- `GET /api/songs/youtube/search` - Search YouTube music
- `GET /api/songs/youtube/trending` - Get trending videos
- `GET /api/songs/youtube/related` - Get related videos
- `GET /api/songs/youtube/video` - Get video details
- `GET /api/songs/youtube/comments` - Get video comments

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Session management
- Google OAuth integration
- Protected routes with middleware

## Database Schema

The User model includes:

- Username (unique, required)
- Email (unique, required)
- Password (hashed, required for local auth)
- Google ID (for OAuth users)
- Avatar URL
- Email verification status
- Timestamps (created, updated)
