# TakeNote API

Express + Prisma backend for user auth and personal notes.

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Fill in `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_URL`.
3. Install and migrate:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```
4. Run:
   ```bash
   npm run dev
   ```

## Production

```bash
npm install
npm run db:migrate:deploy
npm start
```

Set `NODE_ENV=production` and provide env vars from your host (do not ship `.env`).

## Main routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/auth/register` | No | Register |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | No | Clear auth cookie |
| GET | `/notes/all-notes` | Yes | List notes (`?page=&limit=`) |
| GET | `/notes/note/:id` | Yes | Get one note |
| POST | `/notes/create-note` | Yes | Create note |
| PUT | `/notes/update-note/:id` | Yes | Update note |
| DELETE | `/notes/delete-note/:id` | Yes | Delete note |

Auth accepts `Authorization: Bearer <token>` or the `jwt` httpOnly cookie.
