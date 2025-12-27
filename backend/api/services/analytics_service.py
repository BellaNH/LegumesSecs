from django.db.models import Sum, F
from django.utils import timezone
from collections import defaultdict
from api.models import Parcelle, UserWilaya, UserSubdivision
from api.services.scoping_service import get_user_scope


def get_superficie_espece_comparison(user=None, year=None):
    """Get superficie comparison by espece for a given year."""
    if year is None:
        year = timezone.now().year
    
    queryset = Parcelle.objects.filter(
        deleted__isnull=True,
        espece__deleted__isnull=True,
        annee=year
    )
    
    if user:
        scope = get_user_scope(user)
        if scope and not scope.get("is_superuser"):
            if scope.get("wilaya"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision__wilaya=scope["wilaya"]
                )
            elif scope.get("subdivision"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision=scope["subdivision"]
                )
            else:
                return []
    
    stats = queryset.values(espece_nom=F("espece__nom")).annotate(
        total_superficie=Sum("superficie"),
        total_sup_labouree=Sum("sup_labouree"),
        total_sup_emblavee=Sum("sup_emblavee"),
        total_sup_recoltee=Sum("sup_recoltee"),
        total_sup_sinistree=Sum("sup_sinsitree"),
        total_sup_deserbee=Sum("sup_deserbee"),
    ).order_by("espece_nom")
    
    return list(stats)


def get_yearly_production(user=None, years_range=None):
    """Get yearly production data for multiple years."""
    if years_range is None:
        current_year = timezone.now().year
        years_range = list(range(current_year - 9, current_year + 1))
    
    queryset = Parcelle.objects.filter(
        annee__in=years_range,
        deleted__isnull=True,
        espece__deleted__isnull=True
    )
    
    if user:
        scope = get_user_scope(user)
        if scope and not scope.get("is_superuser"):
            if scope.get("wilaya"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision__wilaya=scope["wilaya"]
                )
            elif scope.get("subdivision"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision=scope["subdivision"]
                )
            else:
                return []
    
    raw_data = queryset.values("espece__nom", "annee").annotate(
        total_production=Sum("production")
    ).order_by("espece__nom", "annee")
    
    espece_dict = defaultdict(list)
    for entry in raw_data:
        espece_dict[entry["espece__nom"]].append({
            "year": entry["annee"],
            "total_production": entry["total_production"] or 0
        })
    
    result = []
    for espece, records in espece_dict.items():
        year_map = {r["year"]: r["total_production"] for r in records}
        full_years = [{"year": y, "total_production": year_map.get(y, 0)} for y in years_range]
        result.append({"espece": espece, "yearly_production": full_years})
    
    return result


def get_top_wilayas_by_espece(user=None, year=None, limit=3):
    """Get top locations by production for each espece."""
    if year is None:
        year = timezone.now().year
    
    queryset = Parcelle.objects.filter(
        annee=year,
        production__isnull=False
    )
    
    group_by = "exploitation__commune__subdivision__wilaya__nom"
    
    if user:
        scope = get_user_scope(user)
        role_nom = user.role.nom.lower() if user.role else None
        
        if role_nom == "agent_dsa" and scope and scope.get("wilaya"):
            queryset = queryset.filter(
                exploitation__commune__subdivision__wilaya=scope["wilaya"]
            )
            group_by = "exploitation__commune__subdivision__nom"
        elif role_nom == "agent_subdivision" and scope and scope.get("subdivision"):
            queryset = queryset.filter(
                exploitation__commune__subdivision=scope["subdivision"]
            )
            group_by = "exploitation__commune__nom"
        elif scope and not scope.get("is_superuser"):
            return []
    
    queryset = queryset.values("espece__nom", group_by).annotate(
        total_production=Sum("production")
    ).order_by("espece__nom", "-total_production")
    
    result_dict = defaultdict(list)
    
    for row in queryset:
        espece = row["espece__nom"]
        location = row[group_by]
        production = row["total_production"]
        
        if len(result_dict[espece]) < limit:
            result_dict[espece].append({
                "label": location,
                "total_production": production
            })
    
    result = []
    for espece, top_locations in result_dict.items():
        result.append({
            "espece": espece,
            "top_locations": top_locations
        })
    
    return result


def get_sup_lab_sin_prod_by_espece(user=None):
    """Get superficie labouree, sinistree, and production by espece."""
    queryset = Parcelle.objects.filter(deleted__isnull=True)
    
    if user:
        scope = get_user_scope(user)
        if scope and not scope.get("is_superuser"):
            if scope.get("wilaya"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision__wilaya=scope["wilaya"]
                )
            elif scope.get("subdivision"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision=scope["subdivision"]
                )
            else:
                return []
    
    stats = {}
    for parcelle in queryset.select_related("espece"):
        espece_name = parcelle.espece.nom if parcelle.espece else "Inconnue"
        
        if espece_name not in stats:
            stats[espece_name] = {
                "espece": espece_name,
                "total_sup_labouree": 0.0,
                "total_sup_sinistree": 0.0,
                "total_production": 0.0
            }
        
        stats[espece_name]["total_sup_labouree"] += parcelle.sup_labouree or 0
        stats[espece_name]["total_sup_sinistree"] += parcelle.sup_sinsitree or 0
        stats[espece_name]["total_production"] += parcelle.production or 0
    
    for values in stats.values():
        values["total_sup_labouree"] = round(values["total_sup_labouree"], 2)
        values["total_sup_sinistree"] = round(values["total_sup_sinistree"], 2)
        values["total_production"] = round(values["total_production"], 2)
    
    return list(stats.values())


def get_prev_production_vs_production(user=None):
    """Get previous production vs actual production comparison."""
    queryset = Parcelle.objects.select_related(
        "espece",
        "exploitation__commune__subdivision__wilaya"
    )
    
    if user:
        scope = get_user_scope(user)
        if scope and not scope.get("is_superuser"):
            if scope.get("wilaya"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision__wilaya=scope["wilaya"]
                )
            elif scope.get("subdivision"):
                queryset = queryset.filter(
                    exploitation__commune__subdivision=scope["subdivision"]
                )
            else:
                return []
    
    grouped_stats = queryset.values("espece__nom").annotate(
        prev_de_production=Sum("prev_de_production"),
        production=Sum("production")
    )
    
    data = [
        {
            "espece": item["espece__nom"],
            "prev_de_production": round(item["prev_de_production"] or 0, 2),
            "production": round(item["production"] or 0, 2),
        }
        for item in grouped_stats
    ]
    
    return data



















