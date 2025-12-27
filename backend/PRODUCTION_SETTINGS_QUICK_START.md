# Production Settings - Quick Start Guide

## Environment Setup

### Development
In your `.env` file:
```ini
DJANGO_ENVIRONMENT=development
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production
In your `.env` file:
```ini
DJANGO_ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Key Differences

### Development Settings
- `DEBUG = True`
- Relaxed security (for local development)
- Allows HTTP connections
- Permissive CORS

### Production Settings
- `DEBUG = False` (enforced)
- All security headers enabled
- HTTPS enforced
- Strict CORS validation
- HSTS enabled

## Security Headers in Production

All these are automatically enabled in production:
- ✅ SSL Redirect
- ✅ Secure Cookies
- ✅ XSS Protection
- ✅ Content Type Sniffing Prevention
- ✅ Clickjacking Protection (DENY)
- ✅ HSTS (1 year)

## Testing

### Check Settings
```bash
python manage.py check --deploy
```

### Verify Environment
```python
from django.conf import settings
print(settings.DEBUG)  # Should be False in production
print(settings.SECURE_SSL_REDIRECT)  # Should be True in production
```

## Deployment Checklist

- [ ] Set `DJANGO_ENVIRONMENT=production` in `.env`
- [ ] Set `ALLOWED_HOSTS` to your production domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to your frontend URLs
- [ ] Verify `DEBUG=False` (automatic in production)
- [ ] Run `python manage.py collectstatic`
- [ ] Test HTTPS redirect
- [ ] Verify security headers




















