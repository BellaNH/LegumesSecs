from rest_framework import generics
from .models import *
from .serializers import *
from .scoping import *
from .permissions import DEFAULT_PERMISSIONS
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated ,IsAdminUser,AllowAny,BasePermission
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth import login
from rest_framework.views import APIView
from django.db.models import Sum, F
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from collections import defaultdict
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

class HasModelPermissions(BasePermission):
    message = "Action non autorisée."
 
    def has_permission(self, request, view):
        user = request.user

        if user.is_superuser:
            return True

        action = view.action 
        model_name = getattr(view, 'model_name', None)

        if not model_name:
            return False
        perm = user.permissions.filter(model=model_name).first()

        if not perm:
            return False
        if action == "create":
            return perm.create
        elif action in ["list", "retrieve"]:
            return perm.retrieve
        elif action in ["update", "partial_update"]:
            return perm.update
        elif action == "destroy":
            return perm.destroy



class GenericRolePermission(BasePermission):
    message = "Action non autorisée."

    def has_permission(self, request, view):
        user = request.user

        if user.is_superuser:
            return True

        role_id = getattr(user.role, 'id', None)

        model_name = getattr(view, 'model_name', None)

        if not model_name:
            return False

        if role_id == 2:  
            return True

        if role_id in [3, 4]:  
            if view.action in ['list', 'retrieve']:
                return True
            else:
                return False

        return False


class UserList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Utilisateur"
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.prefetch_related('permissions').all()



class ResetPasswordView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response({"error": "Email et nouveau mot de passe requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except user.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé avec cet email."}, status=status.HTTP_404_NOT_FOUND)

        user.password = make_password(new_password)
        user.save()

        return Response({"success": "Mot de passe mis à jour avec succès."}, status=status.HTTP_200_OK)



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        print(user.role.nom)
        if user.role.nom.lower() == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user)
                user_data['wilaya'] = WilayaSerializer(user_wilaya.wilaya).data
            except UserWilaya.DoesNotExist:
                user_data['wilaya'] = None

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                user_subdiv = UserSubdivision.objects.get(user=user)
                subdivision_obj = user_subdiv.subdivision
                user_data['subdivision'] = SubDivisionSerializer(subdivision_obj).data
                user_data['wilaya'] = WilayaSerializer(subdivision_obj.wilaya).data
            except UserSubdivision.DoesNotExist:
                user_data['subdivision'] = None
                user_data['wilaya'] = None
        print(user_data )
        return Response(user_data)





@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return Response({
                "message": "Login réussi ",
                "user": {
                "id": user.id,
                "email": user.email,
                "nom": user.nom,
                "prenom": user.prenom,
                "role": user.role.nom,
            }
        })
        else:
            return Response({"error": "Identifiants incorrects"}, status=401)



class UserWilayaList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name="Utilisateur"
    serializer_class = UserWilayaSerializer
    def get_queryset(self):
        queryset = UserWilaya.objects.all()
        user_id = self.request.query_params.get('user',None)
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset


class UserSubdivList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name="Utilisateur"
    serializer_class = UserSubdivSerializer
    def get_queryset(self):
        queryset = UserSubdivision.objects.all()
        user_id = self.request.query_params.get('user',None)
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset



class PermissionList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name="Utilisateur"
    queryset = Permissions.objects.all()
    serializer_class = PermissionsSerializer


class TokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer    


class EspeceList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, GenericRolePermission]
    model_name = "Espece"
    queryset = Espece.objects.all()
    serializer_class = EspeceSerializer
    @action(detail=False, methods=['get'], url_path='count')
    def count_especes(self, request):
        count = self.queryset.count()
        return Response(count)

class AgriculteurList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Agriculteur"
    queryset = Agriculteur.objects.all()
    serializer_class = AgriculteurSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role.nom.lower() == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user).wilaya
                return Agriculteur.objects.filter(
                    exploitations__commune__subdivision__wilaya=user_wilaya,
                    deleted__isnull=True
                ).distinct()
            except UserWilaya.DoesNotExist:
                return Agriculteur.objects.none()

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                user_subdiv = UserSubdivision.objects.get(user=user).subdivision
                return Agriculteur.objects.filter(
                    exploitations__commune__subdivision=user_subdiv,
                    deleted__isnull=True
                ).distinct()
            except UserSubdivision.DoesNotExist:
                return Agriculteur.objects.none()

        return Agriculteur.objects.filter(deleted__isnull=True)

class ActiveAgriculteurThisYearView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = timezone.now().year

        queryset = Agriculteur.objects.filter(
            deleted__isnull=True,
            exploitations__deleted__isnull=True,
            exploitations__parcelle__deleted__isnull=True,
            exploitations__parcelle__annee=current_year
        ).distinct()

        user = request.user
        if user and user.is_authenticated:
            if user.role.nom.lower() == "agent_dsa":
                try:
                    user_wilaya = UserWilaya.objects.get(user=user).wilaya
                    queryset = queryset.filter(
                        exploitations__commune__subdivision__wilaya=user_wilaya
                    )
                except UserWilaya.DoesNotExist:
                    queryset = Agriculteur.objects.none()

            elif user.role.nom.lower() == "agent_subdivision":
                try:
                    user_subdiv = UserSubdivision.objects.get(user=user).subdivision
                    queryset = queryset.filter(
                        exploitations__commune__subdivision=user_subdiv
                    )
                except UserSubdivision.DoesNotExist:
                    queryset = Agriculteur.objects.none()

        return Response({"count": queryset.count()})


    

class WilayaList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,GenericRolePermission]
    model_name = "Wilaya"
    queryset =  Wilaya.objects.all()
    serializer_class = WilayaSerializer


class SubDivisionList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,GenericRolePermission]
    model_name = "SubDivision"
    queryset = SubDivision.objects.all()
    serializer_class = SubDivisionSerializer

class CommuneList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,GenericRolePermission]
    model_name = "Commune"
    queryset = Commune.objects.all()
    serializer_class = CommuneSerializer


class ObjectifList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Objectif"
    serializer_class = ObjectifSerializer

    def get_queryset(self):
        queryset = Objectif.objects.all()
        user = self.request.user

        if user.role.nom.lower() == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user).wilaya
                queryset = queryset.filter(wilaya=user_wilaya)
            except UserWilaya.DoesNotExist:
                queryset = Objectif.objects.none()

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                user_subdiv = UserSubdivision.objects.get(user=user).subdivision
                user_wilaya = user_subdiv.wilaya
                queryset = queryset.filter(wilaya=user_wilaya)
            except UserSubdivision.DoesNotExist:
                queryset = Objectif.objects.none()

        return queryset



class SubDivisionsByWilayaView(generics.ListAPIView):
    serializer_class = SubDivisionSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        wilaya_id = self.request.query_params.get('wilaya')
        if wilaya_id:
            return SubDivision.objects.filter(wilaya__id=wilaya_id)
        return SubDivision.objects.none()

class communeByWilayaView(generics.ListAPIView):
    serializer_class = CommuneSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        wilaya_id = self.request.query_params.get('wilaya')
        if wilaya_id:
            return Commune.objects.filter(subdivision__wilaya__id=wilaya_id)
        return Commune.objects.none()

class RoleList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,GenericRolePermission]
    model_name = "Role"
    queryset = Role.objects.all()
    serializer_class = RoleSerializer






class CommunesBySubdivisionView(generics.ListAPIView):
    serializer_class = CommuneSerializer

    def get_queryset(self):
        subdiv_id = self.request.query_params.get('subdivision')
        if subdiv_id:
            return Commune.objects.filter(subdivision__id=subdiv_id)
        return Commune.objects.none()




class ExploitationList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name='Exploitation'
    queryset = Exploitation.objects.all()
    serializer_class = ExploitationSerializer


class ParcelleList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name='Exploitation'
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer
 
class SuperficieComparaisionByEspece(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = timezone.now().year
        user = request.user

        queryset = Parcelle.objects.filter(
            deleted__isnull=True,
            espece__deleted__isnull=True,
            annee=current_year
        )

        if user.role.nom.lower() == "agent_dsa":
            try:
                wilaya = UserWilaya.objects.get(user=user).wilaya
                queryset = queryset.filter(exploitation__commune__subdivision__wilaya=wilaya)
            except UserWilaya.DoesNotExist:
                queryset = queryset.none()

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                subdivision = UserSubdivision.objects.get(user=user).subdivision
                queryset = queryset.filter(exploitation__commune__subdivision=subdivision)
            except UserSubdivision.DoesNotExist:
                queryset = queryset.none()

        stats = queryset.values(espece_nom=F("espece__nom")).annotate(
            total_superficie=Sum("superficie"),
            total_sup_labouree=Sum("sup_labouree"),
            total_sup_emblavee=Sum("sup_emblavee"),
            total_sup_recoltee=Sum("sup_recoltee"),
            total_sup_sinistree=Sum("sup_sinsitree"),
            total_sup_deserbee=Sum("sup_deserbee"),
        ).order_by("espece_nom")

        return Response(stats)


class YearlyProductionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = timezone.now().year
        years_range = list(range(current_year - 9, current_year + 1))

        user = request.user
        queryset = Parcelle.objects.filter(
            annee__in=years_range,
            deleted__isnull=True,
            espece__deleted__isnull=True
        )

        if user.role.nom.lower() == "agent_dsa":
            try:
                wilaya = UserWilaya.objects.get(user=user).wilaya
                queryset = queryset.filter(exploitation__commune__subdivision__wilaya=wilaya)
            except UserWilaya.DoesNotExist:
                queryset = queryset.none()
        elif user.role.nom.lower() == "agent_subdivision":
            try:
                subdivision = UserSubdivision.objects.get(user=user).subdivision
                queryset = queryset.filter(exploitation__commune__subdivision=subdivision)
            except UserSubdivision.DoesNotExist:
                queryset = queryset.none()

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

        return Response(result)


class TopWilayasByEspeceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = timezone.now().year
        user = request.user

        queryset = Parcelle.objects.filter(
            annee=current_year,
            production__isnull=False
        )

        group_by = "exploitation__commune__subdivision__wilaya__nom"

        if user.role.nom.lower() == "agent_dsa":
            try:
                wilaya = UserWilaya.objects.get(user=user).wilaya
                queryset = queryset.filter(exploitation__commune__subdivision__wilaya=wilaya)
                group_by = "exploitation__commune__subdivision__nom"
            except UserWilaya.DoesNotExist:
                return Response([])

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                subdivision = UserSubdivision.objects.get(user=user).subdivision
                queryset = queryset.filter(exploitation__commune__subdivision=subdivision)
                group_by = "exploitation__commune__nom"
            except UserSubdivision.DoesNotExist:
                return Response([])

        queryset = queryset.values("espece__nom", group_by).annotate(
            total_production=Sum("production")
        ).order_by("espece__nom", "-total_production")

        result = []
        espece_tracker = defaultdict(int)

        for row in queryset:
            espece = row["espece__nom"]
            label = row[group_by]
            if espece_tracker[espece] < 3:
                result.append({
                    "espece": espece,
                    "label": label,
                    "total_production": row["total_production"],
                })
                espece_tracker[espece] += 1

        return Response(result)

class SupLaboureeSinistreeProductionByEspeceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        parcelles = Parcelle.objects.filter(deleted__isnull=True)

        if user.role.nom.lower() == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user).wilaya
                parcelles = parcelles.filter(
                    exploitation__commune__subdivision__wilaya=user_wilaya
                )
            except UserWilaya.DoesNotExist:
                return Response([])

        elif user.role.nom.lower() == "agent_subdivision":
            try:
                user_subdivision = UserSubdivision.objects.get(user=user).subdivision
                parcelles = parcelles.filter(
                    exploitation__commune__subdivision=user_subdivision
                )
            except UserSubdivision.DoesNotExist:
                return Response([])

        stats = {}
        for parcelle in parcelles.select_related("espece"):
            espece_name = parcelle.espece.nom if parcelle.espece else "Inconnue"

            if espece_name not in stats:
                stats[espece_name] = {
                    "espece": espece_name,
                    "total_sup_labouree": 0,
                    "total_sup_sinistree": 0,
                    "total_production": 0
                }

            stats[espece_name]["total_sup_labouree"] += parcelle.sup_labouree or 0
            stats[espece_name]["total_sup_sinistree"] += parcelle.sup_sinsitree or 0
            stats[espece_name]["total_production"] += parcelle.production or 0

        return Response(list(stats.values()))



class ExploitationWithParcelledList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Exploitation"
    serializer_class = ExploitationWithParcellesSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Exploitation.objects.all()
        role_nom = user.role.nom.lower()
        print(role_nom)
        if role_nom == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user).wilaya
                queryset = queryset.filter(
                    commune__subdivision__wilaya=user_wilaya
                )
            except UserWilaya.DoesNotExist:
                queryset = Exploitation.objects.none()  

        elif role_nom == "agent_subdivision":
            try:
                user_subdivision = UserSubdivision.objects.get(user=user).subdivision
                queryset = queryset.filter(
                    commune__subdivision=user_subdivision
                )
            except UserSubdivision.DoesNotExist:
                queryset = Exploitation.objects.none()  

        return queryset



class ExploitationFilteredList(generics.ListAPIView):
    permission_classes=[IsAuthenticated,HasModelPermissions]
    model_name="Exploitation"
    serializer_class = ExploitationWithParcellesSerializer

    def get_queryset(self):
        queryset = Exploitation.objects.select_related(
            'commune__subdivision__wilaya'
        ).all()

        wilaya_id = self.request.query_params.get('wilaya')
        subdivision_id = self.request.query_params.get('subdivision')
        commune_id = self.request.query_params.get('commune')

        if wilaya_id:
            queryset = queryset.filter(commune__subdivision__wilaya__id=wilaya_id)
        if subdivision_id:
            queryset = queryset.filter(commune__subdivision__id=subdivision_id)
        if commune_id:
            queryset = queryset.filter(commune__id=commune_id)

        return queryset

class AgriculteurFilteredList(generics.ListAPIView):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Agriculteur"
    serializer_class = AgriculteurSerializer

    def get_queryset(self):
        queryset = Agriculteur.objects.filter(deleted__isnull=True)

        wilaya_id = self.request.query_params.get('wilaya')
        subdivision_id = self.request.query_params.get('subdivision')
        commune_id = self.request.query_params.get('commune')

        if wilaya_id:
            queryset = queryset.filter(
                exploitations__commune__subdivision__wilaya__id=wilaya_id,
                exploitations__deleted__isnull=True
            )
        if subdivision_id:
            queryset = queryset.filter(
                exploitations__commune__subdivision__id=subdivision_id,
                exploitations__deleted__isnull=True
            )
        if commune_id:
            queryset = queryset.filter(
                exploitations__commune__id=commune_id,
                exploitations__deleted__isnull=True
            )

        return queryset.distinct()

class PrevProductionVsProductionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role_name = getattr(user.role, "nom", None)

        parcelles = Parcelle.objects.select_related(
            "espece",
            "exploitation__commune__subdivision__wilaya"
        )

        if role_name == "agent_dsa":
            try:
                user_wilaya = UserWilaya.objects.get(user=user).wilaya
                parcelles = parcelles.filter(
                    exploitation__commune__subdivision__wilaya=user_wilaya
                )
            except UserWilaya.DoesNotExist:
                return Response({"error": "Wilaya not assigned to this user"}, status=403)

        elif role_name == "agent_subdivision":
            try:
                user_subdivision = UserSubdivision.objects.get(user=user).subdivision
                parcelles = parcelles.filter(
                    exploitation__commune__subdivision=user_subdivision
                )
            except UserSubdivision.DoesNotExist:
                return Response({"error": "Subdivision not assigned to this user"}, status=403)


        grouped_stats = parcelles.values("espece__nom").annotate(
            prev_de_production=Sum("prev_de_production"),
            production=Sum("production")
        )

        data = [
            {
                "espece": item["espece__nom"],
                "prev_de_production": item["prev_de_production"],
                "production": item["production"],
            }
            for item in grouped_stats
        ]

        return Response(data)
            

        
           





    

    




    



    


  