# Shared Ink

A full-stack blog publishing platform with JWT authentication, refresh token rotation, and role-based access control.


---

## Tech Stack

**Frontend:** React 19, Vite, React Router, TailwindCSS, Axios  
**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt  

---

## Features

- JWT auth — access token (20min, in-memory) + refresh token (7 days, httpOnly cookie)
- Automatic token refresh via Axios interceptor — failed requests retry transparently
- Token rotation — old refresh token invalidated on every refresh
- Role-based access control — admin can delete any post or user
- Dark mode with system preference detection and localStorage persistence
- Paginated blog feed and profile posts
- Reading time estimates, author avatars
- Skeleton loading states, toast notifications
- Fully responsive — mobile and desktop

---

## Local Setup

### 1. Clone

```bash
git clone https://github.com/saikrishnavinjamuri/shared-ink.git
cd shared-ink
```

### 2. Environment variables

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ACCESSTOKEN_SECRET=your_access_token_secret
REFRESHTOKEN_SECRET=your_refresh_token_secret
```

### 3. Install and run

```bash
npm run build   # installs deps + builds frontend
npm run dev     # starts backend with nodemon at localhost:3000
```

Frontend is served from the backend at `localhost:3000`.

> **Frontend HMR (optional):** If actively editing frontend code, run `cd frontend && npm run dev` in a second terminal to get Vite's hot reload at `localhost:5173`.

### 4. Run in production

```bash
npm run build
npm start
```

`npm run build` installs dependencies and builds the frontend. The backend then serves the built frontend from `frontend/dist`.

---

## Authentication Flow

1. Login → backend issues access token (20min) + refresh token (7d httpOnly cookie)
2. Access token stored in React context (memory only, never localStorage)
3. Every request attaches `Authorization: Bearer <token>` via Axios interceptor
4. On 401/403 → interceptor calls `/api/auth/refresh-token`, gets new access token, retries original request
5. Logout → clears cookie and deletes refresh token from database

---

## API Routes

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

---

## Project Structure

```
shared-ink/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/        # verifyToken, authorizeRole
│   ├── models/            # User, Blog, RefreshToken
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/axios.js   # interceptors
│       ├── context/       # AuthContext, ToastContext, ThemeContext
│       ├── components/    # Navbar, Toast, ProtectedRoute, AdminRoute
│       └── pages/
└── package.json           # root — runs backend, builds frontend
```
