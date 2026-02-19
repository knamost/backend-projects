# URL Shortener Service

A REST API that shortens URLs, built with Node.js, Express, PostgreSQL, and Drizzle ORM.

## Tech Stack

| Category         | Technology        |
| ---------------- | ----------------- |
| Runtime          | Node.js           |
| Framework        | Express 5         |
| Database         | PostgreSQL        |
| ORM              | Drizzle ORM       |
| Auth             | JWT               |
| Password Hashing | argon2            |
| Validation       | Zod 4             |
| Containers       | Docker Compose    |

## Prerequisites

- Node.js (v20+)
- pnpm
- Docker & Docker Compose
- Postman or similar (for testing)

## Getting Started

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Create a .env file
#    DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres
#    JWT_SECRET=your-secret-key
#    PORT=8000

# 4. Run database migrations
pnpm drizzle-kit push

# 5. Start the dev server (with --watch)
pnpm dev
```

## API Routes

### Auth (`/user`)

| Method | Endpoint        | Description               | Auth Required |
| ------ | --------------- | ------------------------- | ------------- |
| POST   | `/user/signup`  | Register a new user       | No            |
| POST   | `/user/login`   | Login and receive a JWT   | No            |

### URLs

| Method | Endpoint       | Description                              | Auth Required |
| ------ | -------------- | ---------------------------------------- | ------------- |
| POST   | `/shorten`     | Create a short URL                       | Yes           |
| GET    | `/urls`        | List all URLs for the logged-in user     | Yes           |
| GET    | `/:shortCode`  | Redirect to the original URL             | No            |
| DELETE | `/:id`         | Delete a short URL (owner only)          | Yes           |

## Project Structure

```
src/
  index.js              # App entry point, middleware & route setup
  db/index.js           # Drizzle database connection
  middlewares/
    auth.middleware.js   # JWT parsing (authenticate) & guard (requireAuth)
  models/
    user.model.js        # users table schema
    url.model.js         # urls table schema
    index.js             # barrel export
  routes/
    user.routes.js       # signup & login handlers
    url.routes.js        # shorten, list, redirect, delete handlers
  services/
    user.service.js      # user DB queries (getUserByEmail, createUser)
    url.service.js       # URL DB queries (createShortURL, getUrlByCode, etc.)
  utils/
    hash.js              # argon2 hash & verify
    token.js             # JWT sign & verify
  validation/
    request.validation.js  # Zod schemas for request bodies
    token.validation.js    # Zod schema for JWT payload
```

## Auth

All protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

Get a token by calling `POST /user/login`.