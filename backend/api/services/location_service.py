from django.db.models import Q
from api.models import Wilaya, SubDivision, Commune
from api.services.scoping_service import apply_user_scope


def get_wilayas(user=None):
    """Get all wilayas, optionally filtered by user scope."""
    queryset = Wilaya.objects.all()
    if user:
        queryset = apply_user_scope(queryset, user, "id")
    return queryset


def get_subdivisions(wilaya_id=None, user=None):
    """Get subdivisions, optionally filtered by wilaya and user scope."""
    queryset = SubDivision.objects.all()
    
    if wilaya_id:
        try:
            wilaya_id = int(wilaya_id)
            if wilaya_id > 0:
                queryset = queryset.filter(wilaya__id=wilaya_id)
        except (ValueError, TypeError):
            return SubDivision.objects.none()
    
    if user:
        queryset = apply_user_scope(queryset, user, "wilaya")
    
    return queryset


def get_communes(wilaya_id=None, subdivision_id=None, user=None):
    """Get communes, optionally filtered by wilaya/subdivision and user scope."""
    queryset = Commune.objects.all()
    
    if wilaya_id:
        try:
            wilaya_id = int(wilaya_id)
            if wilaya_id > 0:
                queryset = queryset.filter(subdivision__wilaya__id=wilaya_id)
        except (ValueError, TypeError):
            return Commune.objects.none()
    
    if subdivision_id:
        try:
            subdivision_id = int(subdivision_id)
            if subdivision_id > 0:
                queryset = queryset.filter(subdivision__id=subdivision_id)
        except (ValueError, TypeError):
            return Commune.objects.none()
    
    if user:
        queryset = apply_user_scope(queryset, user, "subdivision__wilaya")
    
    return queryset




















