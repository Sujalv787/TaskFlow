# TaskFlow — Task & Team Management Platform

A full-stack **Task & Team Management Platform** built with React, Node.js, Express, and MongoDB Atlas. Features JWT authentication, full task CRUD, real-time search & filters, dashboard charts, and dark/light mode.

---

## 🚀 Live Demo

| Service    | URL |
|-----------|-----|
| Frontend (Vercel) | [https://task-flow-fawn-seven.vercel.app](https://task-flow-fawn-seven.vercel.app) |
| Backend (Render)  | [https://taskflow-server-38t9.onrender.com](https://taskflow-server-38t9.onrender.com) |
| API Health Check  | [https://taskflow-server-38t9.onrender.com/health](https://taskflow-server-38t9.onrender.com/health) |

---

## 🔑 Test Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | Admin@1234 |
| User  | testuser@example.com | Test@1234 |

> Run `npm run seed` in the `server/` directory to pre-seed these accounts.

---

## 🛠 Tech Stack

| Layer      | Technologies |
|-----------|-------------|
| Frontend  | React 19, Vite, React Router v7, Redux Toolkit, Axios, Recharts, React Hot Toast |
| Backend   | Node.js, Express 4, Morgan, express-rate-limit |
| Database  | MongoDB Atlas, Mongoose |
| Auth      | JWT (jsonwebtoken), bcryptjs |
| Deployment| Frontend → Vercel, Backend → Render |

---

## 📁 Folder Structure

```
Algo Analytics/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Navbar, AppLayout
│   │   │   ├── tasks/         # TaskForm
│   │   │   └── ui/            # StatCard, TaskCard, Modal, SearchFilterBar, Pagination, LoadingPage
│   │   ├── hooks/             # useAuth, useTasks, useUtils (useDebounce, useLocalStorage)
│   │   ├── pages/             # LoginPage, RegisterPage, DashboardPage, TasksPage, TaskDetailPage, CreateTaskPage, EditTaskPage
│   │   ├── services/          # api.js (axios instance), auth.service.js, task.service.js
│   │   ├── store/
│   │   │   ├── slices/        # authSlice.js, taskSlice.js
│   │   │   └── store.js
│   │   ├── utils/             # helpers.js (formatDate, validation, colors)
│   │   ├── App.jsx            # Routing + lazy loading + Suspense
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── .env
│
└── server/                    # Express backend
    ├── config/
    │   ├── config.js          # Env config
    │   └── db.js              # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js
    │   └── task.controller.js
    ├── middleware/
    │   ├── auth.middleware.js  # JWT protect + restrictTo
    │   └── error.middleware.js # Global error handler + 404
    ├── models/
    │   ├── User.js
    │   └── Task.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── task.routes.js
    ├── scripts/
    │   └── seed.js            # Database seeder
    ├── app.js
    ├── server.js
    └── .env
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd "Algo Analytics"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REMEMBER_ME_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
# Seed the database with test accounts + sample tasks
npm run seed

# Start backend dev server
npm run dev
```

Backend will run at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client
npm install
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend will run at **http://localhost:5173**

---

## 📡 API Documentation

All endpoints return JSON. Protected routes require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/auth/users` | Protected | Get all users (for assignment) |

**POST /api/auth/register**
```json
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "Test@1234" }

// Response 201
{ "success": true, "token": "eyJ...", "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "user" } }
```

**POST /api/auth/login**
```json
// Request
{ "email": "john@example.com", "password": "Test@1234", "rememberMe": true }

// Response 200
{ "success": true, "token": "eyJ...", "user": { ... } }
```

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Protected | Get all tasks (with filters, search, pagination) |
| GET | `/api/tasks/stats` | Protected | Get dashboard statistics |
| GET | `/api/tasks/:id` | Protected | Get single task |
| POST | `/api/tasks` | Protected | Create new task |
| PUT | `/api/tasks/:id` | Protected | Update task |
| DELETE | `/api/tasks/:id` | Protected | Delete task |

**GET /api/tasks** — Query Params:
- `search` — search by title/description
- `status` — filter by status (`pending`, `in-progress`, `completed`, `cancelled`)
- `priority` — filter by priority (`low`, `medium`, `high`, `urgent`)
- `sortBy` — field to sort by (default: `createdAt`)
- `sortOrder` — `asc` or `desc`
- `page` — page number (default: 1)
- `limit` — items per page (default: 10)

**POST /api/tasks**
```json
// Request
{
  "title": "Build authentication system",
  "description": "Implement JWT auth",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-10-30",
  "assignedTo": "<userId>"
}
```

### Error Response Format
```json
{ "success": false, "message": "Descriptive error message" }
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/expired JWT) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 429 | Too many requests (rate limited) |
| 500 | Internal Server Error |

---

## ✨ Features

### Core
- ✅ **JWT Authentication** (register, login, logout, remember me)
- ✅ **Dashboard** with stats cards (Total, Pending, In Progress, Completed)
- ✅ **Task CRUD** — Create, Read, Update, Delete
- ✅ **Search** by title/description (debounced)
- ✅ **Filters** by status, priority
- ✅ **Sort** by date, priority, title
- ✅ **Pagination** with smart page controls
- ✅ **Assignee** — assign tasks to team members
- ✅ **Protected Routes** — redirect unauthenticated users

### Bonus
- 🌙 **Dark / Light Mode** toggle (persisted in localStorage)
- 📊 **Charts** — Pie chart (status) + Bar chart (priority) via Recharts
- 🔔 **Toast Notifications** — via react-hot-toast
- ⚡ **Performance** — React.memo, useMemo, useCallback, lazy loading, Suspense

### React Concepts Used
- `useState`, `useEffect`, `useMemo`, `useCallback`
- `React.memo` (StatCard, TaskCard, SearchFilterBar, Pagination, Navbar, Sidebar, TaskForm)
- Custom Hooks: `useAuth`, `useTasks`, `useDebounce`, `useLocalStorage`, `useClickOutside`
- Redux Toolkit for global state
- Lazy Loading + Suspense for all pages
- Context via Redux

---

## 🗄️ Database Models

### User
```
name: String (required, 2-50 chars)
email: String (required, unique, validated)
password: String (hashed with bcrypt, 12 salt rounds)
role: "user" | "admin"
isActive: Boolean
timestamps: createdAt, updatedAt
```

### Task
```
title: String (required, 3-100 chars)
description: String (max 1000 chars)
priority: "low" | "medium" | "high" | "urgent"
status: "pending" | "in-progress" | "completed" | "cancelled"
dueDate: Date (required)
assignedTo: ObjectId (ref User)
createdBy: ObjectId (ref User, required)
tags: [String]
timestamps: createdAt, updatedAt
```

---

## 🚀 Deployment

### Backend → Render

1. Push `server/` to GitHub
2. Create a new **Web Service** on Render
3. Set environment variables in Render dashboard:
   - `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`
4. Start command: `node server.js`

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import to Vercel, set framework preset to **Vite**
3. Set environment variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
4. Deploy!

---

## 📬 Postman Collection

Import the collection from `postman/TaskFlow.postman_collection.json`.

Set variables:
- `base_url`: `http://localhost:5000`
- `token`: (paste JWT from login response)

---

## 📄 License

MIT
