# Configuration Guide

Configure LegumeSec for your environment.

## Environment Variables

LegumeSec uses environment variables for configuration. Copy `env.example` to `.env` and configure:

### Backend Environment Variables

Create `backend/.env` file:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here-generate-a-random-one
DEBUG=True
DJANGO_ENVIRONMENT=development
DJANGO_LOG_LEVEL=INFO

# Database Configuration
DB_NAME=legumsec_db
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Allowed Hosts (comma-separated)
ALLOWED_HOSTS=localhost,127.0.0.1

# Optional: Test Database
USE_TEST_DB=0
```

### Frontend Environment Variables

Create `frontend/.env` file:

```bash
VITE_API_URL=http://localhost:8000
```

## Generating SECRET_KEY

Generate a secure secret key:

```python
# Python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Or use online generator
# https://djecrety.ir/
```

**Never commit SECRET_KEY to version control!**

## Database Configuration

### PostgreSQL Setup

1. **Create Database:**
```bash
createdb legumsec_db
```

2. **Create User (optional):**
```sql
CREATE USER legumsec_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE legumsec_db TO legumsec_user;
```

3. **Update .env:**
```bash
DB_NAME=legumsec_db
DB_USER=legumsec_user
DB_PASSWORD=your_password
```

## Development vs Production

### Development Settings

- `DEBUG=True` - Shows detailed error pages
- `DJANGO_ENVIRONMENT=development` - Uses development settings
- Permissive CORS - Allows localhost origins
- Detailed logging - Console and file logging

### Production Settings

- `DEBUG=False` - Never enable in production!
- `DJANGO_ENVIRONMENT=production` - Uses production settings
- Strict CORS - Only allowed origins
- Security headers enabled
- SSL/HTTPS required

## CORS Configuration

### Development
```bash
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production
```bash
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Logging Configuration

### Log Levels
- `DEBUG` - Detailed information for debugging
- `INFO` - General information
- `WARNING` - Warning messages
- `ERROR` - Error messages
- `CRITICAL` - Critical errors

### Log Files
- `logs/django.log` - Django framework logs
- `logs/api.log` - API application logs

## Security Settings

### Required for Production

1. **Set strong SECRET_KEY**
2. **Set DEBUG=False**
3. **Configure ALLOWED_HOSTS**
4. **Set up SSL/HTTPS**
5. **Use secure database credentials**
6. **Enable security headers** (automatic in production mode)

## API Configuration

### Pagination
- Default page size: 20 items
- Configurable via `PAGE_SIZE` environment variable
- Maximum page size: 100 items

### Rate Limiting
- Login: 5 requests per minute per IP
- Password reset: 5 requests per hour per IP

### JWT Tokens
- Access token lifetime: 60 minutes
- Refresh token lifetime: 7 days
- Token rotation: Enabled
- Token blacklisting: Enabled

## Frontend Configuration

### API URL
```bash
# Development
VITE_API_URL=http://localhost:8000

# Production
VITE_API_URL=https://api.yourdomain.com
```

### Build Configuration
- Build output: `frontend/dist/`
- Static assets: Automatically optimized
- Code splitting: Enabled

## Environment-Specific Files

### .env.example
Template file showing all available variables. **Never commit actual .env files!**

### .gitignore
Ensures `.env` files are not committed:
```
.env
.env.local
.env.development.local
.env.production.local
```

## Configuration Validation

### Backend Check
```bash
cd backend
python manage.py check --deploy
```

### Verify Settings
```bash
python manage.py shell
>>> from django.conf import settings
>>> settings.DEBUG
>>> settings.ALLOWED_HOSTS
```

## Common Configuration Issues

### Database Connection Failed
- Check PostgreSQL is running
- Verify credentials in `.env`
- Test connection: `psql -U postgres -d legumsec_db`

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check frontend `VITE_API_URL` matches backend URL
- Ensure `CORS_ALLOW_CREDENTIALS=True` in development

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify web server configuration

## Next Steps

- ✅ [Deployment Guide](./operations/deployment.md)
- ✅ [Installation Guide](./installation.md)

---

**Configuration complete?** Continue to [Deployment Guide](./operations/deployment.md) for production setup.















