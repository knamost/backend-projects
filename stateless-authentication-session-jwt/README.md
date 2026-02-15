# Stateless Authentication with JWT

REST API with JWT-based stateless authentication using Express v5, PostgreSQL, Drizzle ORM, and Argon2.

## Setup

```bash
pnpm install
docker compose up -d
pnpm drizzle-kit push
pnpm dev
```

`.env`:
```env
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
JWT_SECRET=your_secret_here
```

## API

| Method | Endpoint       | Auth | Description        |
| ------ | -------------- | ---- | ------------------ |
| POST   | `/user/signup` | No   | Register user      |
| POST   | `/user/login`  | No   | Login, returns JWT |
| GET    | `/user`        | Yes  | Get current user   |
| PATCH  | `/user`        | Yes  | Update user        |

Protected routes require `Authorization: Bearer <token>` header.

## Auth Flow

```
Request → attachUser (global, parses token) → isAuthenticated (per-route guard) → Controller
```

- Passwords hashed with Argon2
- Login returns a signed JWT with `{ id, email, name }`
- `attachUser` runs on every request, decodes the token into `req.user`
- `isAuthenticated` rejects with 401 if `req.user` is missing

## Scripts

```bash
pnpm dev          # Dev server (watch mode)
pnpm start        # Production
pnpm drizzle-kit push      # Push schema to DB
pnpm drizzle-kit studio    # Drizzle Studio
```

