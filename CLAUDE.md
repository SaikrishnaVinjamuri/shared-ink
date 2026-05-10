# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Backend (from root):**
```bash
npm run dev       # nodemon backend/server.js (port 3000)
npm start         # node backend/server.js (production)
npm run build     # installs deps + builds frontend
```

**Frontend (from /frontend):**
```bash
npm run dev       # Vite dev server on :5173
npm run build     # production build → frontend/dist
npm run lint      # ESLint
npm run preview   # preview production build
```

No test suite configured.

## Environment

Backend requires `/backend/.env` (or root `.env`):
```
PORT=3000
MONGODB_URI=<mongodb+srv uri>
ACCESSTOKEN_SECRET=<secret>
REFRESHTOKEN_SECRET=<secret>
```

## Architecture

Full-stack blog platform. Backend serves frontend static files in production — both run on port 3000. In dev, Vite runs on :5173 and proxies API calls to the backend.

### Backend (`/backend`)

Express 5 + MongoDB/Mongoose. Entry point: `server.js`.

```
/config/db.js               Mongoose connection
/middleware/authMiddleware.js   verifyToken, authorizeRole
/models/                    userModel, blogModel, refreshTokenModel
/routes/                    authRoute, blogRoutes, userRoutes
/controllers/               authController, blogController, userController
```

**Auth flow:** Access token (JWT, 20min, memory) + Refresh token (JWT, 7d, httpOnly cookie). Refresh tokens stored in MongoDB with TTL index. On refresh: old token deleted, new one issued (rotation). Cookie flags: `httpOnly`, `secure` in prod, `sameSite: Strict` prod / `Lax` dev.

**Middleware chain:** `verifyToken` → `authorizeRole('admin')` on protected routes.

**CORS:** Credentials-enabled for `localhost:5173` and `https://shared-ink.onrender.com`.

### Frontend (`/frontend/src`)

React 19 + React Router DOM 7 + TailwindCSS via Vite plugin.

```
/context/AuthContext.jsx     User state, accessToken, login/logout, auto-refresh on mount
/context/ToastContext.jsx    Ephemeral notifications (success/error/info, 2.5s auto-dismiss)
/api/axios.js               Axios instance with request + response interceptors
/pages/                     Home, Login, Register, write, BlogDetails, EditBlog, Profile, AdminUsers, AdminUserBlogs, NotFound
/components/                Navbar, ProtectedRoute, AdminRoute, Toast
```

**Axios interceptors:**
- Request: injects `Authorization: Bearer <accessToken>` from context
- Response: on 401/403, calls `/api/auth/refresh-token`, updates context, retries original request. Skips retry loop for the refresh endpoint itself.

**Route guards:**
- `ProtectedRoute` — requires `accessToken` in context
- `AdminRoute` — requires `user.role === 'admin'`

### Data Models

| Model | Key fields |
|-------|-----------|
| User | username (unique), email (unique/lowercase), password (bcrypt), role (user\|admin) |
| Blog | title (min 3), content (min 10), authorId (ref User), timestamps |
| RefreshToken | token, userId (unique ref User), createdAt (TTL: 7d auto-delete) |

### API Routes

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/refresh-token` | cookie |
| POST | `/api/auth/logout` | cookie |
| GET | `/api/blogs` | — |
| GET | `/api/blogs/:id` | — |
| GET | `/api/blogs/users/:id/blog` | — |
| POST | `/api/blogs/new-blog` | token |
| POST | `/api/blogs/update/:id` | token (author only) |
| DELETE | `/api/blogs/delete/:id` | token (author or admin) |
| GET | `/api/users/me` | token |
| GET | `/api/users` | token + admin |
| DELETE | `/api/users/:id` | token + admin |

Pagination: `?page=1&limit=5` on list endpoints.

### Production Build

`npm run build` installs backend deps, builds frontend to `frontend/dist`. Backend serves `frontend/dist` as static files and falls back to `index.html` for all non-`/api` routes (SPA support). Production URL: `https://shared-ink.onrender.com`.
