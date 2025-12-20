from django.db.models import Q, Sum, F
from api.models import Parcelle, UserWilaya, UserSubdivision
from api.services.scoping_service import get_user_scope


def get_parcelles(user=None, filters=None):
    """
    Get parcelles with optional filtering by location and user scope.
    
    Args:
        user: User instance for scope filtering
        filters: Dict with optional filter criteria
    
    Returns:
        Filtered queryset
    """
    queryset = Parcelle.objects.filter(deleted__isnull=True).select_related(
        'espece',
        'exploitation__commune__subdivision__wilaya',
        'exploitation__agriculteur'
    )
    
    if user:
        scope = get_user_scope(user)
        if not scope or scope.get("is_superuser"):
            return queryset
        
        if scope.get("wilaya"):
            queryset = queryset.filter(
                exploitation__commune__subdivision__wilaya=scope["wilaya"]
            )
        elif scope.get("subdivision"):
            queryset = queryset.filter(
                exploitation__commune__subdivision=scope["subdivision"]
            )
        else:
            return Parcelle.objects.none()
    
    return queryset

