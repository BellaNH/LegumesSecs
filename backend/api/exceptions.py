from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class CustomAPIException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Une erreur est survenue."
    default_code = "error"

    def __init__(self, detail=None, code=None, status_code=None):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = detail
        if code is not None:
            self.code = code


class ValidationError(CustomAPIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Les données fournies sont invalides."
    default_code = "validation_error"


class NotFoundError(CustomAPIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Ressource non trouvée."
    default_code = "not_found"


class PermissionDeniedError(CustomAPIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Permission refusée."
    default_code = "permission_denied"


class AuthenticationError(CustomAPIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Authentification requise."
    default_code = "authentication_required"


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': {
                'code': getattr(exc, 'default_code', 'error'),
                'message': str(exc.detail) if hasattr(exc, 'detail') else str(exc),
                'status_code': response.status_code
            }
        }
        
        if hasattr(exc, 'detail') and isinstance(exc.detail, dict):
            custom_response_data['error']['details'] = exc.detail
        
        response.data = custom_response_data
        
        log_level = logging.ERROR
        if response.status_code < 500:
            log_level = logging.WARNING
        
        logger.log(
            log_level,
            f"API Error: {exc.__class__.__name__} - {str(exc)}",
            extra={
                'status_code': response.status_code,
                'view': context.get('view').__class__.__name__ if context.get('view') else None,
                'request_path': context.get('request').path if context.get('request') else None,
            }
        )
    else:
        # Log the full exception with traceback
        import traceback
        logger.exception(
            f"Unhandled exception: {exc.__class__.__name__} - {str(exc)}",
            extra={
                'view': context.get('view').__class__.__name__ if context.get('view') else None,
                'request_path': context.get('request').path if context.get('request') else None,
                'traceback': traceback.format_exc(),
            }
        )
        
        # In development, show detailed error. In production, show generic message
        from django.conf import settings
        is_debug = getattr(settings, 'DEBUG', False)
        
        error_message = str(exc) if is_debug else 'Une erreur interne est survenue. Veuillez réessayer plus tard.'
        
        custom_response_data = {
            'error': {
                'code': 'internal_server_error',
                'message': error_message,
                'status_code': 500
            }
        }
        
        # Include traceback in development
        if is_debug:
            custom_response_data['error']['traceback'] = traceback.format_exc()
            custom_response_data['error']['exception_type'] = exc.__class__.__name__
        
        from rest_framework.response import Response
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return response






















