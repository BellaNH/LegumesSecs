from django.db.models import Q
from api.models import Agriculteur, UserWilaya, UserSubdivision
from api.services.scoping_service import get_user_scope


def get_agriculteurs(user=None, filters=None):
    """
    Get agriculteurs with optional filtering by location and user scope.
    
    Args:
        user: User instance for scope filtering
        filters: Dict with optional keys: wilaya_id, subdivision_id, commune_id
    
    Returns:
        Filtered queryset
    """
    queryset = Agriculteur.objects.filter(deleted__isnull=True).select_related()
    
    if filters:
        wilaya_id = filters.get('wilaya')
        subdivision_id = filters.get('subdivision')
        commune_id = filters.get('commune')
        
        if wilaya_id:
            try:
                wilaya_id = int(wilaya_id)
                if wilaya_id > 0:
                    queryset = queryset.filter(
                        exploitations__commune__subdivision__wilaya__id=wilaya_id,
                        exploitations__deleted__isnull=True
                    )
            except (ValueError, TypeError):
                pass
        
        if subdivision_id:
            try:
                subdivision_id = int(subdivision_id)
                if subdivision_id > 0:
                    queryset = queryset.filter(
                        exploitations__commune__subdivision__id=subdivision_id,
                        exploitations__deleted__isnull=True
                    )
            except (ValueError, TypeError):
                pass
        
        if commune_id:
            try:
                commune_id = int(commune_id)
                if commune_id > 0:
                    queryset = queryset.filter(
                        exploitations__commune__id=commune_id,
                        exploitations__deleted__isnull=True
                    )
            except (ValueError, TypeError):
                pass
    
    if user:
        scope = get_user_scope(user)
        if not scope or scope.get("is_superuser"):
            return queryset.distinct()
        
        if scope.get("wilaya"):
            queryset = queryset.filter(
                exploitations__commune__subdivision__wilaya=scope["wilaya"],
                exploitations__deleted__isnull=True
            ).distinct()
        elif scope.get("subdivision"):
            queryset = queryset.filter(
                exploitations__commune__subdivision=scope["subdivision"],
                exploitations__deleted__isnull=True
            ).distinct()
        else:
            return Agriculteur.objects.none()
    
    return queryset.distinct()


def get_active_agriculteurs_this_year(user=None, year=None):
    """Get count of active agriculteurs for a given year."""
    from django.utils import timezone
    from api.models import Exploitation, Parcelle
    
    if year is None:
        year = timezone.now().year
    
    queryset = Agriculteur.objects.filter(
        deleted__isnull=True,
        exploitations__deleted__isnull=True,
        exploitations__parcelle__deleted__isnull=True,
        exploitations__parcelle__annee=year
    ).distinct()
    
    if user:
        scope = get_user_scope(user)
        if not scope or scope.get("is_superuser"):
            return queryset
        
        if scope.get("wilaya"):
            queryset = queryset.filter(
                exploitations__commune__subdivision__wilaya=scope["wilaya"]
            )
        elif scope.get("subdivision"):
            queryset = queryset.filter(
                exploitations__commune__subdivision=scope["subdivision"]
            )
        else:
            return Agriculteur.objects.none()
    
    return queryset

