# ️ Team Task Manager

A full-stack **Team Task Manager** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features JWT authentication, role-based access control (Admin/Member), project management, and task tracking.

---

## ️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Redux Toolkit, React Router v6, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Validation | express-validator |
| HTTP Client | Axios |

---

##  Folder Structure

```
team-task-manager/
 backend/
    src/
       modules/
          auth/           # Signup, login, JWT
          users/          # User model & CRUD
          projects/       # Project model & CRUD
          tasks/          # Task model & CRUD
       middlewares/
          auth.middleware.js
          role.middleware.js
          error.middleware.js
       config/
          db.js
       app.js
    .env.example
    package.json
    server.js
 frontend/
    src/
       modules/
          auth/           # Login, Signup, authSlice
          dashboard/      # Stats & filters
          projects/       # Project list & detail
          tasks/          # Task cards & form
       components/         # Navbar, ProtectedRoute
       services/           # Axios API instance
       store/              # Redux store
       App.jsx
       main.jsx
    .env.example
    package.json
 .gitignore
 README.md
```

---

##  Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB running locally on port `27017` (or a MongoDB Atlas URI)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

The backend starts on **http://localhost:5000**

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_BASE_URL if needed
npm run dev
```

The frontend starts on **http://localhost:5173**

---

##  Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/team-task-manager` |
| `JWT_SECRET` | Secret key for signing JWTs | *(required)* |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

---

##  API Endpoints

### Auth

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/signup` |  |  | Register a new user |
| POST | `/api/auth/login` |  |  | Login and receive JWT |

### Users

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/users` |  | Admin | List all users |
| GET | `/api/users/me` |  | Any | Get current user profile |
| GET | `/api/users/:id` |  | Admin | Get user by ID |

### Projects

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/projects` |  | Any | List projects (user's own) |
| POST | `/api/projects` |  | Admin | Create a new project |
| GET | `/api/projects/:id` |  | Member+ | Get project details |
| PUT | `/api/projects/:id` |  | Admin | Update project |
| DELETE | `/api/projects/:id` |  | Admin | Delete project |
| POST | `/api/projects/:id/members` |  | Admin | Add member to project |
| DELETE | `/api/projects/:id/members/:uid` |  | Admin | Remove member from project |

### Tasks

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/tasks` |  | Any | List tasks (filterable by project/assignee) |
| POST | `/api/tasks` |  | Admin | Create a task |
| GET | `/api/tasks/:id` |  | Any | Get task details |
| PUT | `/api/tasks/:id` |  | Admin | Update task (full) |
| PATCH | `/api/tasks/:id/status` |  | Member | Update own task status |
| DELETE | `/api/tasks/:id` |  | Admin | Delete a task |

---

##  Roles

| Role | Permissions |
|---|---|
| **Admin** | Create/delete projects, manage members, full task CRUD |
| **Member** | View assigned tasks, update status of own tasks |

---

##  License

MIT
