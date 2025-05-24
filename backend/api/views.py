from rest_framework import generics
from .models import *
from .serializers import *
from .scoping import *
from .permissions import CustomPermission
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated ,IsAdminUser,AllowAny
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

class UserList(viewsets.ModelViewSet):
    permission_classe=[AllowAny]
    queryset = CustomUser.objects.all()      
    serializer_class = CustomUserSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

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
    permission_classes=[IsAuthenticated]
    queryset = UserWilaya.objects.all()
    serializer_class = UserWilayaSerializer
    @action(detail=False, methods=['get', 'patch'], url_path='by-user/(?P<user_id>[^/.]+)')
    def get_by_user(self, request, user_id=None):
        try:
            user_wilaya = UserWilaya.objects.get(user__id=user_id)
            if request.method == 'GET':
                serializer = self.get_serializer(user_wilaya)
                return Response(serializer.data)
            elif request.method == 'PATCH':
                serializer = self.get_serializer(user_wilaya, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserWilaya.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)




class UserSubdivList(viewsets.ModelViewSet):
    queryset = UserSubdivision.objects.all()
    serializer_class = UserSubdivSerializer

    @action(detail=False, methods=['get', 'patch'], url_path='by-user/(?P<user_id>[^/.]+)')
    def get_by_user(self, request, user_id=None):
        try:
            user_subdiv = UserSubdivision.objects.get(user__id=user_id)
            if request.method == 'GET':
                serializer = self.get_serializer(user_subdiv)
                return Response(serializer.data)
            elif request.method == 'PATCH':
                serializer = self.get_serializer(user_subdiv, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserSubdivision.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class PermissionList(viewsets.ModelViewSet):
    queryset = Permissions.objects.all()
    serializer_class = PermissionsSerializer


class TokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer    


class EspeceList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Espece.objects.all()
    serializer_class = EspeceSerializer


class AgriculteurList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Agriculteur.objects.all()
    serializer_class = AgriculteurSerializer
    @action(detail=False, methods=["get"])
    def active_this_year(self, request):
        current_year = timezone.now().year
        count = Agriculteur.objects.filter(
            deleted__isnull=True,
            exploitations__deleted__isnull=True,
            exploitations__parcelle__deleted__isnull=True,
            exploitations__parcelle__annee=current_year
        ).distinct().count()


        return Response( count)
    

class WilayaList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset =  Wilaya.objects.all()
    serializer_class = WilayaSerializer



class ObjectifList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Objectif.objects.all()
    serializer_class = ObjectifSerializer


class SubDivisionList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = SubDivision.objects.all()
    serializer_class = SubDivisionSerializer


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
    permission_classes=[AllowAny]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer






class CommuneList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Commune.objects.all()
    serializer_class = CommuneSerializer



class CommunesBySubdivisionView(generics.ListAPIView):
    serializer_class = CommuneSerializer

    def get_queryset(self):
        subdiv_id = self.request.query_params.get('subdivision')
        if subdiv_id:
            return Commune.objects.filter(subdivision__id=subdiv_id)
        return Commune.objects.none()




class ExploitationList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Exploitation.objects.all()
    serializer_class = ExploitationSerializer


class ParcelleList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer
    @action(detail=False, methods=["get"], url_path="aggregated-stats")
    def aggregated_stats(self, request):
        current_year = timezone.now().year
        stats = (
            Parcelle.objects.filter(
                deleted__isnull=True,
                espece__deleted__isnull=True,
                annee=current_year
            )
            .values(espece_nom=F("espece__nom"))
            .annotate(
                total_superficie=Sum("superficie"),
                total_sup_labouree=Sum("sup_labouree"),
                total_sup_emblavee=Sum("sup_emblavee"),
                total_sup_recoltee=Sum("sup_recoltee"),
                total_sup_sinistree=Sum("sup_sinsitree"),
                total_sup_deserbee=Sum("sup_deserbee"),
            )
            .order_by("espece_nom")
        )

        return Response(stats)
    @action(detail=False, methods=["get"], url_path="yearly-production")
    def yearly_production(self, request):
        current_year = timezone.now().year
        years_range = list(range(current_year - 9, current_year + 1))  # last 10 years

        # Query filtered Parcelles with related Espece
        raw_data = (
            Parcelle.objects.filter(
                annee__in=years_range,
                deleted__isnull=True,
                espece__deleted__isnull=True
            )
            .values("espece__nom", "annee")
            .annotate(total_production=Sum("production"))
            .order_by("espece__nom", "annee")
        )

        # Organize data per espece
        from collections import defaultdict
        espece_dict = defaultdict(list)

        for entry in raw_data:
            espece_name = entry["espece__nom"]
            espece_dict[espece_name].append({
                "year": entry["annee"],
                "total_production": entry["total_production"] or 0
            })

        # Fill missing years with 0
        result = []
        for espece, records in espece_dict.items():
            year_map = {r["year"]: r["total_production"] for r in records}
            full_years = [
                {"year": y, "total_production": year_map.get(y, 0)} for y in years_range
            ]
            result.append({
                "espece": espece,
                "yearly_production": full_years
            })

        return Response(result)



class ExploitationWithParcelledList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Exploitation.objects.all()
    serializer_class = ExploitationWithParcellesSerializer

class ExploitationFilteredList(generics.ListAPIView):
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



            

        
           





    

    




    



    


  