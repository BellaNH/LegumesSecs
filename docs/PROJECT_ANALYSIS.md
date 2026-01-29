# LegumeSec – Global Project Analysis

**Date:** 2025-01-29  
**Scope:** Full codebase review (no code changes).  
**Purpose:** Identify incomplete areas, bugs, inconsistencies, and technical debt to support targeted fixes.

---

## 1. Project Overview

- **Stack:** React 18 (Vite 6) frontend + Django 5.1 REST API + PostgreSQL.
- **Auth:** JWT (djangorestframework-simplejwt), access 60 min, refresh 7 days, blacklist + rotation.
- **Structure:** Monorepo with `frontend/`, `backend/`, `docs/`, `assets/`.

---

## 2. Critical Issues (Bugs / Broken Behavior)

### 2.1 Refresh token never stored after login

- **Where:** `frontend/src/Pages/Login.jsx`, `frontend/src/contexts/AuthContext.jsx`.
- **What:** Login receives `{ access, refresh, user }` from `/api/token/` but only passes `access` to `login(access)`. `AuthContext.login(accessToken)` only stores the access token in `localStorage`; the refresh token is never stored.
- **Impact:** After ~60 minutes the access token expires. The 401 interceptor calls `refreshAccessToken()`, which looks for `localStorage.getItem('refreshToken')` and finds nothing, then calls `logout()`. Users are logged out instead of getting a new access token.
- **Fix direction:** Pass `refresh` (and optionally `user`) into the auth flow and persist the refresh token (e.g. in `AuthContext.login`) the same way it’s used in `refreshAccessToken` and `logout`.

### 2.2 Expired token on initial load: no refresh attempt

- **Where:** `frontend/src/contexts/AuthContext.jsx` – `useEffect` on mount.
- **What:** If a stored access token exists, the app calls `/api/me/` with it. On 401 (e.g. token expired), it calls `logout()` immediately.
- **Impact:** With an expired access token but valid refresh token, the user would still be logged out because the code never tries to refresh first.
- **Fix direction:** On 401 from `/api/me/`, call `refreshAccessToken()` first; only call `logout()` if refresh fails or there is no refresh token.

### 2.3 Backend `requirements.txt` encoding

- **Where:** `backend/requirements.txt`.
- **What:** File appears to be UTF-16 (BOM `ÿþ`) with spaces between characters (e.g. `a s g i r e f` instead of `asgiref`).
- **Impact:** `pip install -r requirements.txt` can fail or install wrong packages depending on environment.
- **Fix direction:** Re-save the file as UTF-8 (no BOM) and ensure each line is a single package spec (e.g. `asgiref==3.8.1`).

---

## 3. Configuration & Environment

### 3.1 Hardcoded API base URL

- **Where:**
  - `frontend/src/contexts/AuthContext.jsx` – `url = "https://legumessecs.onrender.com"` in two places (login callback and init `useEffect`).
  - `frontend/src/context.jsx` – `url: "https://legumessecs.onrender.com"` in `useGlobalContext` return value.
  - `frontend/src/utils/axiosInterceptor.js` – `baseUrl = 'https://legumessecs.onrender.com'`.
- **What:** API base URL is hardcoded instead of using `import.meta.env.VITE_API_URL` (or the same source as `frontend/src/services/api/client.js`).
- **Impact:** Local or staging backends require code changes. Risk of mixing clients (e.g. apiClient with env vs axios with hardcoded URL).
- **Note:** `frontend/src/services/api/client.js` correctly uses `import.meta.env.VITE_API_URL || 'https://legumessecs.onrender.com'`. `.env` sets `VITE_API_URL`.

### 3.2 Inconsistent HTTP client usage

- **Where:** Login and `/api/me/` in AuthContext use raw `axios` with a hardcoded base URL; other API calls use `apiClient` (with interceptors and env base URL).
- **What:** Two parallel patterns: global `axios` + hardcoded URL vs `apiClient` + env + `setupApiClient` (token + refresh).
- **Impact:** Token refresh and base URL behave differently for login/me vs rest of app; harder to reason about and to add retries/error handling in one place.

---

## 4. Dead / Unused Code

### 4.1 `axiosInterceptor.js` never used

- **Where:** `frontend/src/utils/axiosInterceptor.js`.
- **What:** Exports `setupAxiosInterceptors(refreshAccessToken, logout)` and configures global `axios` with token and refresh logic. It is not imported anywhere (only `setupApiClient` in `client.js` is used for interceptors).
- **Impact:** Dead code; duplicate interceptor logic; confusion if someone assumes global axios is configured.

### 4.2 Custom exception handler disabled

- **Where:** `backend/crud/settings/base.py` – `REST_FRAMEWORK['EXCEPTION_HANDLER']` is commented out.
- **What:** `api.exceptions.custom_exception_handler` is implemented and formats errors as `{ error: { code, message, status_code } }` but DRF uses the default handler.
- **Impact:** API errors (e.g. validation, 404) use default DRF format. Frontend `apiHelpers.handleApiError` already supports both `error.message` and `detail`, so things work, but custom handler is effectively incomplete/disabled.

---

## 5. Routing & Security

### 5.1 Inconsistent route protection

- **Where:** `frontend/src/App.jsx` – `Routes` and `element` props.
- **What:** Only some routes guard with `isAuthenticated`:
  - Guarded: `""` (root → Dashboard or Login), `/wilayas`, `/dashboard` (explicit).
  - Not guarded: `/slider`, `/role`, `/profile`, `/admin-create-user`, `/utilisateurs`, `/ajouter-utilisateur`, `/modifier-utilisateur/:id`, `/subdivisions`, `/ajouter-subdivision`, `/communes`, `/ajouter-commune`, `/ajouterexploitation`, `/exploitations`, `/espece`, `/ajouteragriculteur`, `/agriculteurs`, `/ajouterparcelle`, `/ajouterobjectif`, `/objectifs`.
- **Impact:** Unauthenticated users can open these URLs. Pages may then fail on API calls (401) or show empty/error state. No central “protected route” pattern.
- **Fix direction:** Either wrap sensitive routes in a single `ProtectedRoute` that redirects to Login when `!isAuthenticated`, or consistently pass `isAuthenticated ? <Page /> : <Login />` for all app routes (excluding login and public pages).

### 5.2 Duplicate route alias

- **Where:** `frontend/src/App.jsx`.
- **What:** `/admin-create-user` and `/ajouter-utilisateur` both render `AjouterUtilisateur`.
- **Impact:** Minor; just redundant. Decide canonical path and use the other only for backward compatibility if needed.

---

## 6. Code Quality & Maintainability

### 6.1 Debug / detective logging in production paths

- **Where:** `frontend/src/contexts/AuthContext.jsx`, `frontend/src/Pages/Login.jsx` – many `console.log` with prefixes like `[AUTH]`, `[LOGIN]`, `[TOKEN]`.
- **What:** Helpful for debugging but always run in production.
- **Impact:** Console noise; minor performance cost; possible leakage of token snippets in logs.
- **Fix direction:** Use a logger (e.g. `frontend/src/utils/logger.js`) and gate verbose logs with `import.meta.env.DEV` or a log level.

### 6.2 Backend debug middleware in base settings

- **Where:** `backend/crud/settings/base.py` – `AuthenticationDebugMiddleware`, `RequestLoggingMiddleware` enabled.
- **What:** Middleware logs auth and request details.
- **Impact:** In production this can log sensitive data. Usually such middleware should be enabled only in development.
- **Fix direction:** Enable these only in `development.py` (or behind a `DEBUG` / feature flag).

### 6.3 Filename with space

- **Where:** `frontend/src/Pages/Dashboard/EspeceSurfaceChart .jsx` (space before `.jsx`).
- **What:** Import in `App.jsx`: `lazy(() => import('./Pages/Dashboard/EspeceSurfaceChart .jsx'))`.
- **Impact:** Works on Windows; can break or confuse tooling/builds on case-sensitive or strict environments; bad practice.
- **Fix direction:** Rename to `EspeceSurfaceChart.jsx` and update the import.

---

## 7. Backend Notes

### 7.1 Logout endpoint

- **Where:** `backend/api/views.py` – `LogoutView`; `backend/api/urls.py` – `path("logout/", ...)`.
- **What:** Expects `refresh_token` in body and blacklists it. Requires `IsAuthenticated` (valid access token).
- **Impact:** Frontend sends `refresh_token` via `authService.logout(refreshToken)` to `/api/logout/`; contract matches. If access token is already expired, logout request will return 401; frontend already continues with local logout even when the API call fails, which is acceptable.

### 7.2 Ratelimit

- **Where:** `backend/crud/settings/base.py` – `django_ratelimit` in INSTALLED_APPS is commented; in `views.py` ratelimit decorators are commented.
- **What:** Rate limiting is disabled.
- **Impact:** No protection against brute-force (e.g. login) or API abuse. Documented as “temporarily disabled for MVP” – should be re-enabled when addressing security.

### 7.3 Permissions

- **Where:** `backend/api/views.py` – `HasModelPermissions`, `GenericRolePermission`; role_id checks (e.g. 2, 3, 4).
- **What:** Role IDs are magic numbers.
- **Impact:** Fragile if roles change or differ per environment. Prefer names or constants.

---

## 8. Frontend Service Layer

- **Where:** `frontend/src/services/api/*.js` and `context.jsx` / `AuthContext` / `DataContext`.
- **What:** Services use `apiClient`; auth uses both `apiClient` and raw `axios`; `context.jsx` aggregates Auth, Data, UI and exposes `url` and `getAuthHeader`.
- **Impact:** `getAuthHeader()` reads token from `localStorage`; most calls already go through `apiClient` which attaches the token. So `getAuthHeader` is redundant for apiClient-based calls but may still be used by code that uses raw axios. Consolidating on apiClient + env base URL would simplify this.

---

## 9. Documentation vs Code

- **Where:** `docs/architecture.md` states Django 4.2+; `requirements.txt` has Django 5.1.6.
- **What:** Doc is slightly out of date.
- **Impact:** Low; update doc when touching architecture.

---

## 10. Summary Table

| Category           | Severity   | Count | Examples |
|--------------------|------------|-------|----------|
| Critical bugs      | High       | 3     | Refresh token not stored; no refresh on /api/me 401; requirements.txt encoding |
| Config / env       | Medium     | 2     | Hardcoded API URL in 4 places; two HTTP client patterns |
| Dead / incomplete  | Low–Medium | 2     | axiosInterceptor unused; custom exception handler disabled |
| Routing / security | Medium     | 2     | Many routes not protected; duplicate route |
| Code quality       | Low        | 3     | Console logs in prod; debug middleware in base; filename with space |
| Backend / security | Low–Medium | 2     | Ratelimit disabled; magic role IDs |

---

## 11. Suggested Order for Fixes (when you send specific issues)

1. **Auth:** Store refresh token on login; on app load, on 401 from `/api/me/`, try refresh then logout.
2. **Config:** Single source for API base URL (env) and use it in AuthContext, context.jsx, and remove or align axiosInterceptor.
3. **requirements.txt:** Fix encoding and line format.
4. **Routing:** Introduce a consistent protection strategy (e.g. ProtectedRoute) and apply to all app routes.
5. **Cleanup:** Remove or use axiosInterceptor; enable custom exception handler if desired; reduce console logs in prod; enable debug middleware only in dev; rename `EspeceSurfaceChart .jsx`.

No code was changed in this analysis; the repo is only read and summarized above. When you send a specific message (e.g. “fix the login refresh token” or “fix requirements.txt”), fixes can be applied in that order or in the order you prefer.
