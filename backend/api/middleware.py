import logging
import re
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

# Netlify origin - ensure CORS headers are always set for this origin (safety net)
NETLIFY_ORIGIN = "https://legumessecs.netlify.app"
ACCESS_CONTROL_ALLOW_ORIGIN = "access-control-allow-origin"
ACCESS_CONTROL_ALLOW_CREDENTIALS = "access-control-allow-credentials"
ACCESS_CONTROL_ALLOW_HEADERS = "access-control-allow-headers"
ACCESS_CONTROL_ALLOW_METHODS = "access-control-allow-methods"
ACCESS_CONTROL_MAX_AGE = "access-control-max-age"


class CORSFallbackMiddleware(MiddlewareMixin):
    """
    Safety net: ensure CORS headers are on every API response for Netlify origin.
    Runs after CorsMiddleware. If response lacks CORS headers for our origin, add them.
    Fixes 'Network Error' when browser blocks response due to missing CORS.
    """
    def process_response(self, request, response):
        if not request.path.startswith("/api/"):
            return response
        origin = request.META.get("HTTP_ORIGIN") or request.headers.get("Origin")
        if not origin:
            return response
        # Allow exactly our Netlify origin (with or without trailing slash)
        if origin.rstrip("/") != NETLIFY_ORIGIN.rstrip("/"):
            return response
        if ACCESS_CONTROL_ALLOW_ORIGIN in response:
            return response
        response[ACCESS_CONTROL_ALLOW_ORIGIN] = origin
        response[ACCESS_CONTROL_ALLOW_CREDENTIALS] = "true"
        if request.method == "OPTIONS":
            response[ACCESS_CONTROL_ALLOW_HEADERS] = (
                "accept, accept-encoding, authorization, content-type, origin, x-requested-with"
            )
            response[ACCESS_CONTROL_ALLOW_METHODS] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response[ACCESS_CONTROL_MAX_AGE] = "86400"
        return response


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        # DISABLED - Let errors show naturally
        # This was hiding the real errors
        return None


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            # Enhanced logging to see authentication issues
            auth_header = request.META.get('HTTP_AUTHORIZATION', 'NOT SET')
            logger.info(
                f"API Request: {request.method} {request.path}",
                extra={
                    'method': request.method,
                    'path': request.path,
                    'auth_header': auth_header[:50] if auth_header != 'NOT SET' else 'NOT SET',  # Log first 50 chars
                    'user': str(request.user) if hasattr(request, 'user') else 'NOT SET',
                }
            )
        return None


class AuthenticationDebugMiddleware(MiddlewareMixin):
    """
    DEBUG MIDDLEWARE - Logs authentication details for /api/me/ requests
    This will help us see exactly why authentication is failing
    """
    def process_request(self, request):
        if request.path == '/api/me/':
            auth_header = request.META.get('HTTP_AUTHORIZATION', None)
            logger.error(f"=== AUTHENTICATION DEBUG for /api/me/ ===")
            logger.error(f"Authorization header: {auth_header}")
            logger.error(f"Request META keys: {list(request.META.keys())}")
            logger.error(f"User before auth: {getattr(request, 'user', 'NOT SET')}")
            logger.error(f"User type: {type(getattr(request, 'user', None))}")
        return None
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path == '/api/me/':
            logger.error(f"=== AFTER AUTHENTICATION MIDDLEWARE ===")
            logger.error(f"User after auth: {request.user}")
            logger.error(f"User type: {type(request.user)}")
            logger.error(f"Is authenticated: {request.user.is_authenticated if hasattr(request.user, 'is_authenticated') else 'N/A'}")
            logger.error(f"Is anonymous: {request.user.is_anonymous if hasattr(request.user, 'is_anonymous') else 'N/A'}")
        return None

