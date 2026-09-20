# TaskFlow – Full-Stack Task Manager

A complete MERN-stack task manager with JWT authentication, protected routes, full task CRUD, search/filter/sort, and a responsive light/dark dashboard.

## Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcrypt.js

## Project Structure
```
task-manager/
├── client/   → React frontend
└── server/   → Express API
```

## 1. Prerequisites
- Node.js 18+
- A MongoDB database (local `mongod`, or a free MongoDB Atlas cluster)

## 2. Backend Setup
```bash
cd server
npm install
```
Edit `server/.env` (a copy of `.env.example` is already created for you):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
> Replace `MONGODB_URI` with your Atlas connection string if not running MongoDB locally, and set a strong random `JWT_SECRET`.

Run the API:
```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```
The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
```
`client/.env` is already created from `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
```
Run the dev server:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

## 4. Using the App
1. Open `http://localhost:5173`
2. Click **Sign up**, create an account (name, email, password)
3. You'll land on the **Dashboard** — create, edit, complete, filter, search, and delete tasks
4. Toggle dark mode from the sidebar; logout returns you to the login page

## 5. API Reference

### Auth
| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `{ name, email, password }` |
| POST | `/api/auth/login` | Public | `{ email, password }` |
| GET | `/api/auth/me` | Private | — (Bearer token) |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks?search=&status=&priority=&sortBy=&order=` | List your tasks (with stats) |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Task fields: `title` (required), `description`, `status` (`Pending`/`In Progress`/`Completed`), `priority` (`Low`/`Medium`/`High`), `dueDate`.

### Sample requests (curl)

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```
Save the returned `token`.

**Create a task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Finish report","priority":"High","status":"In Progress","dueDate":"2026-10-01"}'
```

**List tasks (filtered)**
```bash
curl "http://localhost:5000/api/tasks?status=Pending&sortBy=dueDate&order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update a task**
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"Completed"}'
```

**Delete a task**
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 6. Security Notes
- Passwords are hashed with bcrypt (never stored in plain text)
- JWT is verified on every protected route via middleware
- Every task query is scoped to `req.user._id`; a 403 is returned if a user tries to access another user's task
- Secrets and DB connection string live only in `.env` (never committed — see `.gitignore`)
- CORS is restricted to `CLIENT_URL`

## 7. Notes on Architecture
- **`server/models`** — Mongoose schemas for `User` (password hashing via `pre('save')` hook) and `Task` (with compound indexes for user+status/priority and a text index on title for search)
- **`server/middleware/auth.js`** — `protect` middleware decodes the JWT, loads the user, and attaches `req.user`
- **`server/controllers`** — business logic for auth and task CRUD, including ownership checks
- **`client/src/context/AuthContext.jsx`** — holds the logged-in user, exposes `login`/`register`/`logout`, restores session from `localStorage` + `/auth/me` on load
- **`client/src/services/api.js`** — Axios instance that auto-attaches the JWT and redirects to `/login` on a 401
- **`client/src/pages/Dashboard.jsx`** — stats cards, search/filter/sort controls, task grid, create/edit modal, delete confirmation
