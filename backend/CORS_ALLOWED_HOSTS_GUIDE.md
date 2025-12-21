# ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS Configuration Guide

## ⚠️ CRITICAL RULES

### ALLOWED_HOSTS
- **Format**: Domain names ONLY (no protocol, no port except for localhost)
- **NO** `http://` or `https://`
- **NO** port numbers (except `localhost:8000` for local Django server)
- **Examples**: `localhost`, `127.0.0.1`, `example.com`, `api.example.com`

### CORS_ALLOWED_ORIGINS
- **Format**: Full URLs with protocol (`http://` or `https://`) and port if needed
- **MUST** include `http://` or `https://`
- **MUST** include port for localhost (e.g., `:5173`, `:3000`)
- **NO** port for production HTTPS (standard port 443)
- **Examples**: `http://localhost:5173`, `https://example.com`

---

## 📝 Configuration Examples

### Development (.env file)
```bash
# ALLOWED_HOSTS: Just domain names, comma-separated
ALLOWED_HOSTS=127.0.0.1,localhost

# CORS_ALLOWED_ORIGINS: Full URLs with http:// and port
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

### Production (.env file)
```bash
# ALLOWED_HOSTS: Your backend domain (Render, Railway, etc.)
ALLOWED_HOSTS=legumessecs.onrender.com

# CORS_ALLOWED_ORIGINS: Your frontend URL(s) with https://
CORS_ALLOWED_ORIGINS=https://legumessecs.netlify.app,https://yourdomain.com
```

---

## 🔍 Common Scenarios

### Scenario 1: Local Development
- **Backend**: `http://localhost:8000` (Django)
- **Frontend**: `http://localhost:5173` (Vite)

```bash
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Scenario 2: Backend on Render, Frontend on Netlify
- **Backend**: `https://legumessecs.onrender.com`
- **Frontend**: `https://legumessecs.netlify.app`

```bash
ALLOWED_HOSTS=legumessecs.onrender.com
CORS_ALLOWED_ORIGINS=https://legumessecs.netlify.app
```

### Scenario 3: Custom Domain
- **Backend**: `https://api.yourdomain.com`
- **Frontend**: `https://yourdomain.com`

```bash
ALLOWED_HOSTS=api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Scenario 4: Multiple Frontends
```bash
ALLOWED_HOSTS=legumessecs.onrender.com
CORS_ALLOWED_ORIGINS=https://legumessecs.netlify.app,https://admin.yourdomain.com,https://app.yourdomain.com
```

---

## ✅ Verification Checklist

- [ ] `ALLOWED_HOSTS` has NO `http://` or `https://`
- [ ] `ALLOWED_HOSTS` has NO port (except for localhost if needed)
- [ ] `CORS_ALLOWED_ORIGINS` has `http://` or `https://` prefix
- [ ] `CORS_ALLOWED_ORIGINS` includes port for localhost (e.g., `:5173`)
- [ ] `CORS_ALLOWED_ORIGINS` has NO port for production HTTPS
- [ ] No trailing slashes in URLs
- [ ] No spaces around commas

---

## 🚨 Common Mistakes

❌ **WRONG**:
```bash
ALLOWED_HOSTS=https://legumessecs.onrender.com
CORS_ALLOWED_ORIGINS=legumessecs.netlify.app
```

✅ **CORRECT**:
```bash
ALLOWED_HOSTS=legumessecs.onrender.com
CORS_ALLOWED_ORIGINS=https://legumessecs.netlify.app
```

---

## 🔧 Quick Test

After setting your values, test with:

```bash
# Check if Django accepts the host
python manage.py runserver

# Check CORS in browser console
# Should see: Access-Control-Allow-Origin header
```

