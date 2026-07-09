import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        return None


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            logger.info(
                "API request: %s %s",
                request.method,
                request.path,
            )
        return None
