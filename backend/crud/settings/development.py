from .base import *
import os
import logging

DEBUG = True

# ALLOWED_HOSTS: Domain names only (NO protocol, NO port except for localhost)
# Examples: 'localhost', '127.0.0.1', 'example.com', 'api.example.com'
ALLOWED_HOSTS_STR = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_STR.split(',') if host.strip()]

# CORS_ALLOWED_ORIGINS: Full URLs with protocol (http:// or https://) and port if needed
# Development: Use http://localhost:PORT (no https in local dev)
# Production: Use https://domain.com (no port for standard HTTPS)
CORS_ALLOWED_ORIGINS_STR = os.getenv(
    'CORS_ALLOWED_ORIGINS', 
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000'
)
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_STR.split(',') if origin.strip()]

CORS_ALLOW_CREDENTIALS = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'SAMEORIGIN'

# Cache configuration for development (simple locmem cache - no Redis needed for MVP)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Database query logging: set to INFO to avoid cluttering console with every SQL query.
# Use level 'DEBUG' only when you need to inspect raw SQL.
if DEBUG:
    LOGGING['loggers']['django.db.backends'] = {
        'handlers': ['console'],
        'level': 'INFO',
        'propagate': False,
    }
