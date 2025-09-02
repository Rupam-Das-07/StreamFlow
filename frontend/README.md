# StreamFlow - YouTube Music Streaming Application

A modern, full-stack music streaming application built with Next.js 15 and Express.js, featuring a beautiful YouTube Music-like experience with complete user authentication.

## ✨ Features

### 🎵 Music Streaming

- **YouTube Music Search**: Search for any song, artist, or genre
- **Trending Videos**: Region-based trending music videos (US, IN, UK, JP)
- **Video Player**: YouTube video embedding with autoplay
- **Related Videos**: AI-powered related video suggestions
- **Video Details**: Complete video information display
- **Comments System**: YouTube comments integration

### 🔐 Authentication System

- **User Registration & Login**: Secure email/password authentication
- **Google OAuth**: One-click login with Google accounts
- **JWT Tokens**: Secure session management
- **Protected Routes**: Secure access to user-specific features
- **User Profiles**: Personal profile management
- **Account Settings**: Comprehensive user preferences

### 🎨 User Interface

- **Modern Design**: Beautiful gradient backgrounds and animations
- **Responsive Layout**: Mobile-first responsive design
- **Theme Toggle**: Dark/light mode switching
- **Toast Notifications**: User feedback and error handling
- **Loading States**: Smooth loading animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Google OAuth credentials
- YouTube Data API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd StreamFlow
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file (see backend/SETUP.md for details)
cp .env.example .env

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local

# Start the development server
npm run dev
```

### 4. Open Your Browser

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

```
StreamFlow/
├── frontend/ (Next.js 15)
│   ├── src/app/ - App router pages
│   ├── src/components/ - Reusable UI components
│   ├── src/lib/ - Core libraries and auth
│   └── src/utils/ - API utilities and helpers
├── backend/ (Express.js)
│   ├── routes/ - API endpoints
│   ├── models/ - Data models
│   ├── middleware/ - Express middleware
│   └── config/ - Configuration files
└── docs/ - Setup and documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/streamflow
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
```

#### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Music

- `GET /api/songs/youtube/search` - Search YouTube music
- `GET /api/songs/youtube/trending` - Get trending videos
- `GET /api/songs/youtube/related` - Get related videos
- `GET /api/songs/youtube/video` - Get video details

## 🛠️ Development

### Running Both Servers

```bash
# Start both frontend and backend simultaneously
npm run dev
```

### Backend Only

```bash
cd backend
npm run dev
```

### Frontend Only

```bash
npm run dev:frontend
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Session management
- Google OAuth integration
- Protected routes with middleware

## 📱 User Experience

### Authentication Flow

1. **Registration**: Create account with username, email, and password
2. **Login**: Sign in with email/password or Google OAuth
3. **Profile**: Manage personal information and preferences
4. **Settings**: Configure notifications, privacy, and appearance
5. **Music**: Search, discover, and enjoy music videos

### Features by User Type

- **Guests**: Search music, view trending videos
- **Authenticated Users**: All guest features + profile management, settings, future features

## 🚧 Coming Soon

- Playlist management
- Watch history tracking
- Video like/dislike system
- Channel subscriptions
- Social features
- Advanced recommendations

## 📖 Documentation

- [Backend Setup Guide](backend/SETUP.md) - Complete backend configuration
- [Frontend Setup Guide](FRONTEND_SETUP.md) - Frontend authentication integration
- [API Documentation](backend/SETUP.md#api-endpoints) - Backend API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation files
- Review the setup guides
- Ensure all environment variables are configured
- Verify MongoDB and API connections

---

**StreamFlow** - Where music meets modern web technology 🎵✨
