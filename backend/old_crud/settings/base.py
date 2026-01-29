import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-me-in-production')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    # 'django_ratelimit',  # Temporarily disabled for MVP
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS first (like old version)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'api.middleware.AuthenticationDebugMiddleware',  # DEBUG: Log auth details
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'api.middleware.RequestLoggingMiddleware',  # Re-enabled for debugging
    # ErrorHandlingMiddleware disabled - let errors show naturally
    # 'api.middleware.ErrorHandlingMiddleware',
    'api.middleware.CORSFallbackMiddleware',  # Safety net: ensure CORS on every API response for Netlify
]

# CORS Configuration
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False  # Explicitly set to False for security

ROOT_URLCONF = 'crud.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'crud.wsgi.application'

# Database configuration with DATABASE_URL support (Render provides this automatically)
DATABASE_URL = os.getenv('DATABASE_URL', '').strip()

# Try to use DATABASE_URL first (Render provides this automatically)
if DATABASE_URL:
    try:
        # Parse DATABASE_URL to get connection parameters
        # This handles URL encoding and special characters in passwords
        db_config = dj_database_url.parse(DATABASE_URL, conn_max_age=600)
        
        # Build DATABASES dict from parsed config
        DATABASES = {
            'default': {
                'ENGINE': db_config.get('ENGINE', 'django.db.backends.postgresql'),
                'NAME': db_config.get('NAME'),
                'USER': db_config.get('USER'),
                'PASSWORD': db_config.get('PASSWORD'),
                'HOST': db_config.get('HOST'),
                'PORT': db_config.get('PORT'),
            }
        }
        
        # Add SSL mode (prefer works better with Render than require)
        ssl_mode = os.getenv('DB_SSLMODE', 'prefer')
        if 'OPTIONS' not in DATABASES['default']:
            DATABASES['default']['OPTIONS'] = {}
        DATABASES['default']['OPTIONS']['sslmode'] = ssl_mode
        
        # Add connection pooling options if available
        if 'CONN_MAX_AGE' in db_config:
            DATABASES['default']['CONN_MAX_AGE'] = db_config['CONN_MAX_AGE']
            
    except Exception:
        # If DATABASE_URL parsing fails, try to extract components manually
        from urllib.parse import urlparse, unquote
        
        try:
            # Parse the URL manually
            parsed = urlparse(DATABASE_URL)
            
            # Extract and decode components
            db_name = parsed.path.lstrip('/') if parsed.path else os.getenv('DB_NAME', 'postgres')
            db_user = unquote(parsed.username) if parsed.username else os.getenv('DB_USER', 'postgres')
            db_password = unquote(parsed.password) if parsed.password else os.getenv('DB_PASSWORD', '')
            db_host = parsed.hostname if parsed.hostname else os.getenv('DB_HOST', 'localhost')
            db_port = parsed.port if parsed.port else (os.getenv('DB_PORT', '5432') if not parsed.port else parsed.port)
            
            # SSL mode: 'prefer' works better with Render than 'require'
            ssl_mode = os.getenv('DB_SSLMODE', 'prefer')
            
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.postgresql',
                    'NAME': db_name,
                    'USER': db_user,
                    'PASSWORD': db_password,
                    'HOST': db_host,
                    'PORT': db_port,
                    'OPTIONS': {
                        'sslmode': ssl_mode,
                    },
                }
            }
        except Exception:
            # Final fallback to individual DB_* environment variables
            ssl_mode = os.getenv('DB_SSLMODE', 'prefer')
            
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.postgresql',
                    'NAME': os.getenv('DB_NAME', 'postgres'),
                    'USER': os.getenv('DB_USER', 'postgres'),
                    'PASSWORD': os.getenv('DB_PASSWORD', ''),
                    'HOST': os.getenv('DB_HOST', 'localhost'),
                    'PORT': os.getenv('DB_PORT', '5432'),
                    'OPTIONS': {
                        'sslmode': ssl_mode,
                    },
                }
            }
else:
    # Fallback to individual DB_* environment variables if DATABASE_URL not set
    ssl_mode = os.getenv('DB_SSLMODE', 'prefer')
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'postgres'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
            'OPTIONS': {
                'sslmode': ssl_mode,
            },
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Algiers'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'api.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': int(os.getenv('PAGE_SIZE', '20')),
    'PAGE_SIZE_QUERY_PARAM': 'page_size',
    'MAX_PAGE_SIZE': 100,
    # Temporarily disabled to debug 500 errors - re-enable after fixing
    # 'EXCEPTION_HANDLER': 'api.exceptions.custom_exception_handler',
}

AUTHENTICATION_BACKENDS = [
    'api.authenticate.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Ensure logs directory exists
LOGS_DIR = BASE_DIR / 'logs'
LOGS_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'formatter': 'verbose',
        },
        'api_file': {
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'api.log'),
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'api': {
            'handlers': ['console', 'api_file'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}
