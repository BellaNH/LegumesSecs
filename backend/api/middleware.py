import logging
import traceback
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.exception(
            f"Unhandled exception in middleware: {exception.__class__.__name__}",
            extra={
                'request_path': request.path,
                'request_method': request.method,
                'user': str(request.user) if hasattr(request, 'user') else None,
            }
        )
        
        if request.path.startswith('/api/'):
            return JsonResponse(
                {
                    'error': {
                        'code': 'internal_server_error',
                        'message': 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
                        'status_code': 500
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return None


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            logger.info(
                f"API Request: {request.method} {request.path}",
                extra={
                    'method': request.method,
                    'path': request.path,
                    'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous',
                }
            )
        return None


















