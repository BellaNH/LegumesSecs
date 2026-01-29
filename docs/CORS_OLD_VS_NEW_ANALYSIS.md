# CORS: Old vs New – Analysis (no code changes)

**Scope:** CORS and origin-related settings only.  
**Sources:** `old_crud/settings.py.backup` (old single-file settings) vs `backend/crud/settings/*` (new split settings).

---

## 1. Where CORS is defined

| | Old | New |
|---|-----|-----|
| **Layout** | Single file: `old_crud/settings.py.backup` | Split: `backend/crud/settings/base.py` + `production.py` + `development.py` |
| **CORS in base** | Not used (no base) | `base.py`: only `CORS_ALLOW_CREDENTIALS = True`, `CORS_ALLOW_ALL_ORIGINS = False` |
| **CORS for prod** | Same as below (one default for all envs) | `production.py`: env + Netlify fallback + `CORS_ALLOW_HEADERS` |
| **CORS for dev** | Same default as prod | `development.py`: env with localhost default only |

---

## 2. Old version (`old_crud/settings.py.backup`)

**CORS-related lines (only):**

```python
# CORS configuration from environment
CORS_ALLOWED_ORIGINS_STR = os.getenv(
    'CORS_ALLOWED_ORIGINS', 
    'http://localhost:5173,https://legumessecs.netlify.app,https://aminephone.netlify.app'
)
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_STR.split(',') if origin.strip()]
```

**Behaviour:**

- **Single env:** One `DEBUG`/env model; same CORS for “all” environments.
- **Default value:** If `CORS_ALLOWED_ORIGINS` is **not set**, it uses:
  - `http://localhost:5173`
  - `https://legumessecs.netlify.app`
  - `https://aminephone.netlify.app`
- **No** `CORS_ALLOW_CREDENTIALS` or `CORS_ALLOW_ALL_ORIGINS` in this file (corsheaders uses its own defaults if not set).
- **No** `CORS_ALLOW_HEADERS` (corsheaders default is used).
- **No** validation: app always starts; CORS list can be empty only if env is set to something that splits to an empty list.

So in the old setup, **Netlify was in the default**. If you didn’t set `CORS_ALLOWED_ORIGINS` on Render, it still worked because the default included `https://legumessecs.netlify.app`.

---

## 3. New version (`backend/crud/settings/`)

### 3.1 `base.py`

- `CORS_ALLOW_CREDENTIALS = True`
- `CORS_ALLOW_ALL_ORIGINS = False`
- **No** `CORS_ALLOWED_ORIGINS` here (only in production/development).

### 3.2 `production.py` (current, after our fixes)

- Reads env: `CORS_ALLOWED_ORIGINS` **or** `CORS_ALLOWED_ORIGIN` (typo accepted).
- Default if both missing: `''` → `CORS_ALLOWED_ORIGINS` can start as `[]`.
- Then **always** appends `https://legumessecs.netlify.app` if not already in the list.
- Sets `CORS_ALLOW_CREDENTIALS = True`.
- Sets `CORS_ALLOW_HEADERS` explicitly (accept, accept-encoding, authorization, content-type, origin, x-requested-with).

So in the **current** new version, production always allows the Netlify origin even when env is wrong or empty.

### 3.3 `development.py`

- `CORS_ALLOWED_ORIGINS_STR = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000')`
- **Default has no Netlify URLs** (only localhost).
- `CORS_ALLOW_CREDENTIALS = True` only.

---

## 4. Differences (CORS / origin-related only)

| Aspect | Old (`settings.py.backup`) | New (`backend/crud/settings/`) |
|--------|----------------------------|----------------------------------|
| **Default CORS origins** | Includes `https://legumessecs.netlify.app` and `https://aminephone.netlify.app` when env not set | **Production:** no default list in env, but code **always** appends `https://legumessecs.netlify.app`. **Development:** default is localhost only (no Netlify). |
| **Env var required in prod** | No; default has Netlify | Originally yes (raise if empty); **now** no (we append Netlify and accept empty env). |
| **Env var name** | Only `CORS_ALLOWED_ORIGINS` | `CORS_ALLOWED_ORIGINS` **or** `CORS_ALLOWED_ORIGIN` (typo handled). |
| **CORS_ALLOW_CREDENTIALS** | Not set in file (library default) | Set explicitly to `True` in base + prod + dev. |
| **CORS_ALLOW_ALL_ORIGINS** | Not set | Set to `False` in base. |
| **CORS_ALLOW_HEADERS** | Not set (library default) | Set explicitly in **production** (accept, authorization, content-type, etc.). |
| **Split prod vs dev** | No; one default for all | Yes; production vs development defaults differ (prod gets Netlify in code; dev gets localhost in default). |

---

## 5. Why “it worked before” vs “CORS broke after”

- **Old:** Default `CORS_ALLOWED_ORIGINS` **included** `https://legumessecs.netlify.app`. So even with no (or wrong) env on Render, Netlify was allowed.
- **New (before our fixes):** Production had **no** default origins and **required** `CORS_ALLOWED_ORIGINS` to be set; if it was missing or wrong (e.g. typo `CORS_ALLOWED_ORIGIN`), the list could be empty → CORS blocked Netlify.
- **New (after our fixes):** Production always appends `https://legumessecs.netlify.app` and accepts both env var names, so Netlify is allowed again even when env is wrong or empty.

---

## 6. Summary

- **Old:** Single settings file; CORS default **included Netlify**; no explicit credentials/headers; no prod/dev split.
- **New:** Split base/production/development; production **now** guarantees Netlify origin in code and tolerates env typo; explicit `CORS_ALLOW_CREDENTIALS`, `CORS_ALLOW_ALL_ORIGINS`, and `CORS_ALLOW_HEADERS` in production.

No code was changed; this is analysis only.
