# StreamFlow

A modern music streaming platform with a Next.js frontend and an Express.js + MongoDB backend. Stream, like, and organize music with playlists, and keep your watch history—plus Google sign-in, email verification, and account management.

## ✨ Highlights

- **YouTube-powered streaming**: Search, play, and browse trending and related videos
- **Auth**: Email/password + Google OAuth, JWT-based sessions
- **User features**: Liked videos, Playlists (create/manage), Watch history
- **Email flows**: Verify email, resend verification, delete account (with email)
- **Polished UX**: Theme-aware logo, sidebar with hamburger toggle, one-time welcome/feature popups

## 🧱 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose), JWT, Passport (Google)
- **APIs**: YouTube Data API v3
- **Email**: Nodemailer (Ethereal in dev)

## 📦 Monorepo Structure

```
StreamFlow/
├─ frontend/               # Next.js app (App Router)
│  ├─ src/app/             # Routes & pages
│  ├─ src/components/      # UI components
│  ├─ src/lib/             # Auth context, utils
│  ├─ src/utils/           # API client
│  └─ public/              # Static assets (logos, icons)
├─ backend/                # Express API server
│  ├─ routes/              # API endpoints
│  ├─ models/              # Mongoose schemas
│  ├─ services/            # Email service, etc.
│  └─ index.ts             # Server entry
└─ README.md               # You are here
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- YouTube Data API key
- Google OAuth credentials (for Google sign in)

### 1) Clone and install

```bash
git clone <your-repo-url>
cd StreamFlow

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2) Environment variables

Copy and fill the env templates:

- `frontend/.env.example` → `frontend/.env.local`
- `backend/env.example` → `backend/.env`

Required keys (non-exhaustive):

- Frontend: `NEXT_PUBLIC_API_URL`
- Backend: `MONGO_URI`, `JWT_SECRET`, `YOUTUBE_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`

### 3) Run locally

In two terminals (or use a process manager):

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

## 🔐 Key Features

- Auth: Login/Register, Google OAuth, token-based sessions
- Email: Verify email, resend verification, delete-account confirmation
- Video: Search, trending, related, details (YouTube API)
- Liked videos: Toggle like, view likes
- Playlists: Create/delete playlists, add/remove videos
- History: Auto-add on watch, view/clear/remove

## 🧭 Important Commands

Frontend:

```bash
npm run dev       # Start Next.js
npm run build     # Build for production
npm run lint      # Lint
```

Backend:

```bash
npm run dev       # Start Express in dev (nodemon)
npm run build     # TypeScript build
```

## 📚 Further Docs

- `frontend/FRONTEND_SETUP.md` – Frontend-specific setup
- `frontend/AUTHENTICATION_SETUP.md` – Auth flows and context
- `backend/SETUP.md` – Backend configuration and routes

## 📝 API Overview (selected)

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/resend-verification`, `GET /api/auth/verify-email/:token`, `DELETE /api/auth/delete-account`
- User: Likes/Playlists/Stats via `backend/routes/user.ts`
- History: `POST /api/history/add`, `GET /api/history`, `DELETE /api/history/clear`, `DELETE /api/history/remove/:id`
- Music: `GET /api/songs/youtube/search|trending|related|video`

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch: `git checkout -b feat/amazing`
3. Commit: `git commit -m "feat: add amazing thing"`
4. Push: `git push origin feat/amazing`
5. Open a Pull Request

## 📄 License

MIT — see `LICENSE`.

## 🙌 Acknowledgments

YouTube Data API, Next.js, Tailwind CSS, and the open-source community.
