# 📘 Shared Ink

A secure full-stack publishing platform demonstrating JWT authentication with refresh token rotation, role-based access control (RBAC), and automatic session renewal.

Built using **React (Vite)** + **Node.js/Express** + **MongoDB**.

---

## 🚀 Live Features

### 👤 Authentication

- User registration  
- Login with JWT authentication  
- Short-lived Access Token (10 minutes)  
- Refresh Token stored in **httpOnly cookie** (7 days)  
- Automatic token refresh using Axios interceptor  
- Secure logout with cookie invalidation  

---

### 📝 Blog System

- Create blog posts  
- Edit your own posts  
- Delete your own posts  
- View full blog details  
- Paginated blog feed (Home page)  
- Paginated profile posts  

---

### 🛡 Role-Based Access Control

- Admin-only protected routes  
- Admin can:
  - View all users  
  - Delete users  
  - Delete any blog  
- Protected routes using React route guards  

---

### 🎯 UI/UX

- Fully responsive design (mobile + desktop)  
- Clean single-column layout  
- Toast notifications  
- Custom 404 page  
- Loading states  
- Navigation history handling  
- Admin & user route protection  

---

## 🧠 Architecture Overview

### Frontend

- React (Vite)
- React Router
- Context API (Auth + Toast)
- Axios with interceptors
- TailwindCSS
- Role-based route protection

### Backend

- Node.js
- Express
- MongoDB (Mongoose)
- JWT authentication
- Refresh token rotation
- Cookie-based auth (httpOnly)
- CORS with credentials
- Protected API routes
- Role-based middleware

---

## 🔐 Authentication Flow

1. User logs in  
2. Backend issues:
   - Access Token (10 minutes)
   - Refresh Token (7 days, httpOnly cookie)
3. Access token stored in memory  
4. Axios interceptor:
   - Detects expired token  
   - Calls `/auth/refresh-token`  
   - Retries failed request automatically  
5. Logout clears refresh token and session  

---

## 🗄 Database Models

### User
- username
- email
- password (hashed)
- role (`user` | `admin`)

### Blog
- title
- content
- authorId (ref: User)
- createdAt / updatedAt

### RefreshToken
- userId (unique)
- token
- createdAt (expires in 7 days)

---

## 🛡 Security Implementations

- Password hashing (bcrypt)
- httpOnly refresh cookies
- Token rotation
- Role-based authorization middleware
- Protected React routes
- Automatic access token refresh
- CORS configured with credentials
- Duplicate token protection (Mongo index fix)

---

## ⚙️ Environment Variables (Backend)

````
PORT=3000
MONGO_URI=your_mongodb_connection_string
ACCESSTOKEN_SECRET=your_secret
REFRESHTOKEN_SECRET=your_secret
````


---

## 💻 Local Setup

### 1️⃣ Clone repository

````
git clone https://github.com/yourusername/shared-ink.git
````


### 2️⃣ Backend

````
cd backend
npm install
npm run dev
````


### 3️⃣ Frontend

````
cd frontend
cd shared-ink
npm install
npm run dev
````

## 🎯 Skills Demonstrated

- Full-stack application architecture
- JWT authentication with refresh token rotation
- Role-based access control (RBAC)
- Secure REST API development
- Axios interceptors for token lifecycle management
- React Context state management
- Responsive UI with TailwindCSS
- Production-ready cookie handling
- Deployment planning and environment configuration
