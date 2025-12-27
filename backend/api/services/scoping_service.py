from django.db.models import Q
from api.models import CustomUser, UserWilaya, UserSubdivision


def get_user_scope(user):
    """
    Get the scope (wilaya/subdivision) for a user based on their role.
    Returns a dict with wilaya and subdivision if applicable.
    """
    if not user or not user.is_authenticated:
        return None
    
    if user.is_superuser:
        return {"is_superuser": True}
    
    role_nom = user.role.nom.lower() if user.role else None
    
    if role_nom == "agent_dsa":
        try:
            user_wilaya = UserWilaya.objects.get(user=user)
            return {"wilaya": user_wilaya.wilaya}
        except UserWilaya.DoesNotExist:
            return None
    
    elif role_nom == "agent_subdivision":
        try:
            user_subdiv = UserSubdivision.objects.get(user=user)
            return {
                "subdivision": user_subdiv.subdivision,
                "wilaya": user_subdiv.subdivision.wilaya
            }
        except UserSubdivision.DoesNotExist:
            return None
    
    return None


def apply_user_scope(queryset, user, model_field_path=None):
    """
    Apply user scope filtering to a queryset.
    
    Args:
        queryset: Django queryset to filter
        user: User instance
        model_field_path: Path to location field (e.g., 'commune__subdivision__wilaya')
    
    Returns:
        Filtered queryset
    """
    scope = get_user_scope(user)
    
    if not scope or scope.get("is_superuser"):
        return queryset
    
    if scope.get("wilaya") and model_field_path:
        wilaya_path = f"{model_field_path}__wilaya" if "wilaya" not in model_field_path else model_field_path.split("__wilaya")[0] + "__wilaya"
        return queryset.filter(**{wilaya_path: scope["wilaya"]})
    
    if scope.get("subdivision") and model_field_path:
        subdiv_path = f"{model_field_path}__subdivision" if "subdivision" not in model_field_path else model_field_path.split("__subdivision")[0] + "__subdivision"
        return queryset.filter(**{subdiv_path: scope["subdivision"]})
    
    return queryset.none()



















