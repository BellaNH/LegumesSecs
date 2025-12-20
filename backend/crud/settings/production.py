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

CORS_ALLOWED_ORIGINS_STR = os.getenv('CORS_ALLOWED_ORIGINS', '')
if not CORS_ALLOWED_ORIGINS_STR:
    raise ValueError(
        "CORS_ALLOWED_ORIGINS must be set in production. "
        "Please set CORS_ALLOWED_ORIGINS in your .env file with comma-separated origins."
    )
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_STR.split(',') if origin.strip()]

CORS_ALLOW_CREDENTIALS = True

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

