# Session Based Authentication

Simple backend authentication using session-based auth with Node.js, Express 5, Drizzle ORM, PostgreSQL (Docker), and Argon2 for password hashing.

## Tech Stack

Node.js, Express 5, PostgreSQL, Drizzle ORM, Argon2, Docker, pnpm

## Setup

```bash
pnpm install
docker-compose up -d
npx drizzle-kit push
pnpm dev
```

Create a `.env`:
```env
DATABASE_URL=postgres://<user_name>:<password>@localhost:5432/postgres
PORT=8000
```

## API Endpoints

All user routes are prefixed with `/user`. Protected routes require `session-id` header.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/user/signup` | No | Register a new user |
| `POST` | `/user/login` | No | Login, returns `sessionId` |
| `GET` | `/user/` | Yes | Get current logged-in user |
| `PATCH` | `/user/` | Yes | Update name, email or password |

### Signup
```json
{ "name": "John", "email": "john@example.com", "password": "secret" }
```

### Login
```json
{ "email": "john@example.com", "password": "secret" }
```
Returns `sessionId` — use it as `session-id` header for protected routes.

### Update User
```json
{ "name": "New Name", "email": "new@email.com" }
```
To update password, include `currentPassword`:
```json
{ "password": "newpass", "currentPassword": "oldpass" }
```

## Project Structure

```
├── index.js              # Express app + global middleware
├── controllers/          # Route handlers (signup, login, update)
├── routes/               # Route definitions
├── middleware/            # attachUser, isAuthenticated
├── db/
│   ├── index.js          # Drizzle DB connection
│   └── schema.js         # users + user_sessions tables
├── docker-compose.yml    # PostgreSQL container
└── .env                  # DB url + port
```

## How It Works

- Passwords are hashed with **Argon2id** (salt is embedded in the hash, no separate column needed)
- On login, any existing sessions for the user are deleted and a new session is created — only one active session per user at a time
- The `attachUser` middleware runs on every request — if a valid `session-id` header is present, it joins `user_sessions` with `users` and attaches the user to `req.user`
- Protected routes use `isAuthenticated` middleware which returns 401 if `req.user` is not set

