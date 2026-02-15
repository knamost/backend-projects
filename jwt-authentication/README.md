# JWT Authentication

REST API with JWT-based stateless authentication using Express v5, PostgreSQL, Drizzle ORM, and Argon2.

## Setup

```bash
pnpm install
docker compose up -d
pnpm db:push
pnpm dev
```

`.env`:
```env
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
JWT_SECRET=your_secret_here
```

## API

### User Routes (`/user`)

| Method | Endpoint       | Auth | Description        |
| ------ | -------------- | ---- | ------------------ |
| POST   | `/user/signup` | No   | Register user      |
| POST   | `/user/login`  | No   | Login, returns JWT |
| GET    | `/user`        | Yes  | Get current user   |
| PATCH  | `/user`        | Yes  | Update user        |

### Admin Routes (`/admin`)

| Method | Endpoint       | Auth       | Description    |
| ------ | -------------- | ---------- | -------------- |
| GET    | `/admin/users` | Yes, ADMIN | Get all users  |

Protected routes require `Authorization: Bearer <token>` header.

## Auth Flow

```
Request → attachUser (global, parses token) → requireAuth (per-route guard) → restrictRole (role check) → Controller
```

### Middleware

| Middleware       | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `attachUser`     | Runs globally, decodes JWT into `req.user`       |
| `requireAuth`    | Per-route guard, rejects 401 if not logged in    |
| `restrictRole()` | Per-route guard, rejects 403 if role doesn't match |

- Passwords hashed with Argon2
- Login returns a signed JWT with `{ id, email, name, role }` (expires in 7 days)
- Users have a `role` field (`USER` or `ADMIN`)

## Scripts

```bash
pnpm dev            # Dev server (watch mode)
pnpm start          # Production
pnpm db:push        # Push schema to DB
pnpm db:studio      # Drizzle Studio
```

