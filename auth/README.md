# Reusable Auth Kit

Copy-paste authentication extracted from RealTime Collaboration.

This folder is **standalone**. The live app under `client/` and `server/` was **not modified** and keeps working as before.

## What you get

- Register / login / logout
- Email verification + resend
- Access JWT (memory) + refresh token (httpOnly cookie)
- Forgot / reset password
- Auth middleware for protected API routes
- React pages, Zustand store, Axios client with silent refresh
- Route guards (`ProtectedRoute`, `PublicOnlyRoute`) + session bootstrap

## Folder map

```
reusable-auth/
  README.md                          ← you are here
  server/
    .env.example
    prisma/auth-schema.prisma        ← paste models into your schema
    src/
      controllers/auth.controller.ts
      routes/auth.routes.ts
      schemas/auth.schemas.ts
      services/auth.service.ts
      services/token.service.ts
      services/email.service.ts      ← verification + reset only
      middleware/auth.middleware.ts
      middleware/validate.middleware.ts
      middleware/error.middleware.ts
      lib/prisma.ts                  ← adjust import path to your Prisma client
      types/express.ts               ← req.user typing
  client/
    .env.example
    wiring/                          ← paste snippets into App / main
    src/
      pages/                         ← Login, Register, Verify, Forgot, Reset
      components/                    ← AuthShell, AuthBootstrap, route guards, FormMessage
      services/                      ← api, auth.api, token-storage, get-api-error-message
      store/auth.store.ts
      types/auth.ts
```

## 1. Server install

```bash
npm install bcrypt jsonwebtoken nodemailer cookie-parser cors zod dotenv express
npm install -D @types/bcrypt @types/jsonwebtoken @types/nodemailer @types/cookie-parser @types/cors @types/express
```

Also need Prisma + PostgreSQL (same pattern as this project, or adapt `lib/prisma.ts`).

## 2. Server copy-paste

1. Copy `server/src/**` into your API project, keeping the relative paths (or update imports).
2. Merge `server/prisma/auth-schema.prisma` into your Prisma schema.
3. Run migrations: `npx prisma migrate dev --name add_auth`
4. Copy env keys from `server/.env.example`.
5. Wire Express (see `client/wiring` sibling note below — server wiring):

```ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "dotenv/config";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import "./types/express.js"; // ensure Express.Request.user is typed

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const app = express();

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
```

6. Protect any route with `authenticateToken` from `middleware/auth.middleware.ts`.

### Prisma client path

`lib/prisma.ts` imports from `../../generated/prisma/client.js` (this project's layout). Point it at **your** generated client.

## 3. Client install

```bash
npm install axios zustand react-router-dom
```

Tailwind classes are used on pages — keep Tailwind or restyle.

## 4. Client copy-paste

1. Copy `client/src/**` into your React app (`src/`).
2. Set `VITE_API_URL` and optional `VITE_APP_NAME` (see `client/.env.example`).
3. Wrap the app with `AuthBootstrap` + `BrowserRouter` — see `client/wiring/main.snippet.tsx`.
4. Mount auth routes — see `client/wiring/App.routes.snippet.tsx`.
5. After login, pages navigate to `/dashboard` — change that path if needed in `LoginPage` / `PublicOnlyRoute`.

## 5. Auth API surface

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | public |
| POST | `/auth/verify-email` | public |
| POST | `/auth/resend-verification-email` | public |
| POST | `/auth/login` | public (sets refresh cookie) |
| POST | `/auth/refresh` | cookie |
| POST | `/auth/logout` | cookie |
| POST | `/auth/forgot-password` | public |
| POST | `/auth/reset-password` | public |
| GET | `/auth/me` | Bearer access token |

Refresh cookie: `refreshToken`, `httpOnly`, `path=/auth`, 7 days.

## 6. Differences from this app's live code

The kit is the same auth behavior, with **app-specific pieces removed** so it drops into other projects cleanly:

| Live app | This kit |
|----------|----------|
| Register creates `notificationPreference` | User create only (no nested preference) |
| Login/Register/Verify tied to invitations | Plain auth UX only |
| `email.service` includes invites/tasks | Verification + password reset only |
| `AuthShell` hardcodes product name | `VITE_APP_NAME` / `APP_NAME` |
| `get-api-error-message` has workspace codes | Auth codes only |
| Express `Request` has workspace membership | `user` only |

Your **running** RealTime Collaboration app is unchanged and still has invitation + notification preference behavior.

## 7. Quick smoke test

1. Register → check SMTP or server console for verification link
2. Open `/verify-email?token=...`
3. Login → access token in memory, refresh cookie set
4. Call a protected route with `Authorization: Bearer ...`
5. Forgot password → reset link → login again
6. Logout → refresh fails / session cleared

## Optional: Socket.IO

If you need sockets later, verify the access JWT from `socket.handshake.auth.token` with `verifyAccessToken` (same as this project's `server/src/socket/socket.ts`). Not required for HTTP auth alone.
