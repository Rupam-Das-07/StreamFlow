# Frontend Authentication Integration Guide

## Overview

The StreamFlow frontend now includes a complete authentication system with:

- User registration and login
- Google OAuth integration
- Protected routes
- User profile management
- Settings page
- JWT token management

## Features Implemented

### 1. Authentication Pages

- **Login Page** (`/login`) - Email/password login with Google OAuth
- **Register Page** (`/register`) - User account creation
- **Profile Page** (`/profile`) - User profile and statistics
- **Settings Page** (`/settings`) - Account preferences and settings
- **OAuth Callback** (`/auth/callback`) - Handles Google OAuth redirects

### 2. Authentication Context

- Global authentication state management
- Automatic token verification
- User session persistence
- Protected route handling

### 3. User Interface

- Dynamic header with user menu
- Authentication status indicators
- Loading states and error handling
- Toast notifications for user feedback

## Setup Instructions

### 1. Install Dependencies

The required dependencies are already included in `package.json`:

- `@radix-ui/react-avatar` - User avatar components
- `@radix-ui/react-dropdown-menu` - User menu dropdown
- `sonner` - Toast notifications
- `lucide-react` - Icons

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Backend Connection

Ensure your backend is running on port 4000 and has the authentication system set up.

## Usage

### Authentication State

The authentication state is available throughout the app using the `useAuth` hook:

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Protected Routes

Use the `ProtectedRoute` component to protect pages that require authentication:

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Authentication Functions

Import authentication functions from `@/lib/auth`:

```tsx
import { login, signup, logout, googleLogin } from "@/lib/auth";

// Login
await login(email, password);

// Signup
await signup(username, email, password);

// Google OAuth
googleLogin();

// Logout
logout();
```

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # Authentication utilities
│   └── auth-context.tsx     # React context for auth state
├── components/
│   ├── Header.tsx           # Updated header with user menu
│   ├── ProtectedRoute.tsx   # Route protection component
│   └── ...                  # Other components
├── app/
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   ├── profile/
│   │   └── page.tsx         # User profile page
│   ├── settings/
│   │   └── page.tsx         # Settings page
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx     # OAuth callback handler
│   └── layout.tsx           # Updated with AuthProvider
```

## User Experience Flow

### 1. Registration

1. User visits `/register`
2. Fills out username, email, and password
3. Form validation and submission
4. Account creation and automatic login
5. Redirect to home page

### 2. Login

1. User visits `/login`
2. Enters email and password
3. Form validation and submission
4. JWT token storage and user session
5. Redirect to home page

### 3. Google OAuth

1. User clicks "Continue with Google"
2. Redirect to Google OAuth
3. User authorizes StreamFlow
4. Google redirects back with token
5. Token processing and user session
6. Redirect to home page

### 4. Protected Features

- User profile management
- Account settings
- Future features (playlists, history, etc.)

## Security Features

- JWT token storage in localStorage
- Automatic token verification
- Protected route handling
- Secure logout with token removal
- CORS configuration with backend

## Customization

### Styling

All components use Tailwind CSS and can be customized by modifying the classes or creating custom variants.

### Authentication Logic

Modify `src/lib/auth.ts` to change authentication behavior, API endpoints, or token handling.

### User Interface

Update components in `src/components/` to modify the look and feel of authentication elements.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for `http://localhost:3000`
2. **Token Issues**: Check browser localStorage for stored tokens
3. **OAuth Redirect**: Verify Google OAuth redirect URI configuration
4. **Database Connection**: Ensure MongoDB is running and accessible

### Debug Mode

Enable console logging in `src/lib/auth.ts` for debugging authentication issues.

## Next Steps

The authentication system is now fully integrated. Future enhancements could include:

- Password reset functionality
- Email verification
- Two-factor authentication
- Social login providers (Facebook, Twitter, etc.)
- User roles and permissions
- Advanced profile customization
