from .base import *
import os

DEBUG = False

ALLOWED_HOSTS_STR = os.getenv('ALLOWED_HOSTS', '')
if not ALLOWED_HOSTS_STR:
    raise ValueError(
        "ALLOWED_HOSTS must be set in production. "
        "Please set ALLOWED_HOSTS in your .env file with comma-separated host names."
    )
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_STR.split(',') if host.strip()]

# CORS: accept both CORS_ALLOWED_ORIGINS and CORS_ALLOWED_ORIGIN (common typo)
CORS_ALLOWED_ORIGINS_STR = os.getenv('CORS_ALLOWED_ORIGINS') or os.getenv('CORS_ALLOWED_ORIGIN') or ''
CORS_ALLOWED_ORIGINS = [o.strip() for o in CORS_ALLOWED_ORIGINS_STR.split(',') if o and o.strip()]

# Always allow Netlify frontend (exact origin, no trailing slash)
NETLIFY_ORIGIN = 'https://legumessecs.netlify.app'
if NETLIFY_ORIGIN not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(NETLIFY_ORIGIN)

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
    'x-requested-with',
]

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

