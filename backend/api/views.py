from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView as BaseTokenObtainPairView, TokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from django.db.models import Sum, F
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
# from django_ratelimit.decorators import ratelimit  # Temporarily disabled for MVP
from collections import defaultdict
import logging
from .models import *
from .serializers import *
from rest_framework import serializers
from .scoping import *
from .permissions import DEFAULT_PERMISSIONS

logger = logging.getLogger(__name__)

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

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}", exc_info=True)
            logger.error(f"Request data: {request.data}")
            raise
    
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            # Re-raise ValidationError as-is (already properly formatted)
            raise
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}", exc_info=True)
            logger.error(f"Request data: {request.data}")
            logger.error(f"User ID: {kwargs.get('pk')}")
            # Return proper error response
            return Response({
                'error': {
                    'code': 'update_error',
                    'message': f'Erreur lors de la mise à jour: {str(e)}',
                    'details': str(e) if hasattr(e, '__cause__') else None
                }
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



class ResetPasswordView(APIView):
    permission_classes=[AllowAny]
    
    # @method_decorator(ratelimit(key='ip', rate='5/h', method='POST'))  # Temporarily disabled for MVP
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            logger.warning(f"Password reset attempt with missing fields: email={bool(email)}")
            return Response({
                "error": {
                    "code": "validation_error",
                    "message": "Email et nouveau mot de passe requis.",
                    "status_code": 400
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            logger.warning(f"Password reset attempt with weak password for email: {email}")
            return Response({
                "error": {
                    "code": "validation_error",
                    "message": "Le mot de passe doit contenir au moins 8 caractères.",
                    "status_code": 400
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            logger.info(f"Password reset successful for user: {email}")
            return Response({"success": "Mot de passe mis à jour avec succès."}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            logger.warning(f"Password reset attempt for non-existent user: {email}")
            return Response({
                "error": {
                    "code": "not_found",
                    "message": "Utilisateur non trouvé avec cet email.",
                    "status_code": 404
                }
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error resetting password for {email}: {str(e)}", exc_info=True)
            raise



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # DEBUG: Log authentication details
            logger.info(f"CurrentUserView - Request headers: {dict(request.headers)}")
            logger.info(f"CurrentUserView - User type: {type(request.user)}")
            logger.info(f"CurrentUserView - User: {request.user}")
            logger.info(f"CurrentUserView - Is authenticated: {request.user.is_authenticated if hasattr(request.user, 'is_authenticated') else 'N/A'}")
            logger.info(f"CurrentUserView - Is anonymous: {request.user.is_anonymous if hasattr(request.user, 'is_anonymous') else 'N/A'}")
            
            # Check if user is authenticated
            if not request.user or not request.user.is_authenticated:
                logger.error(f"CurrentUserView - User not authenticated. User: {request.user}, Type: {type(request.user)}")
                from rest_framework.exceptions import AuthenticationFailed
                raise AuthenticationFailed("User not authenticated")
            
            user = request.user
            logger.info(f"CurrentUserView - Authenticated user ID: {user.id}, Email: {getattr(user, 'email', 'N/A')}")
            
            # Check if user has role
            if not hasattr(user, 'role') or user.role is None:
                logger.warning(f"CurrentUserView - User {user.id} has no role assigned")
            
            user_data = UserSerializer(user).data
            logger.info(f"CurrentUserView - User data serialized successfully: {user_data.get('id')}")
            
            # DETECTIVE PRINT: Like old version
            print(f"[CURRENT_USER] User ID: {user.id}, Email: {user.email}")
            print(f"[CURRENT_USER] User role: {user.role.nom if user.role else 'None'}")
            print(f"[CURRENT_USER] User data: {user_data}")
            
            # Check if user has a role before accessing it
            if user.role and hasattr(user.role, 'nom'):
                role_name = user.role.nom.lower()
                logger.info(f"CurrentUserView - User role: {role_name}")
                print(f"[CURRENT_USER] Role name: {role_name}")
                
                if role_name == "agent_dsa":
                    try:
                        user_wilaya = UserWilaya.objects.get(user=user)
                        user_data['wilaya'] = WilayaSerializer(user_wilaya.wilaya).data
                        logger.info(f"CurrentUserView - Added wilaya for agent_dsa")
                    except UserWilaya.DoesNotExist:
                        user_data['wilaya'] = None
                        logger.warning(f"CurrentUserView - User {user.id} (agent_dsa) has no assigned wilaya")

                elif role_name == "agent_subdivision":
                    try:
                        user_subdiv = UserSubdivision.objects.get(user=user)
                        subdivision_obj = user_subdiv.subdivision
                        user_data['subdivision'] = SubDivisionSerializer(subdivision_obj).data
                        user_data['wilaya'] = WilayaSerializer(subdivision_obj.wilaya).data
                        logger.info(f"CurrentUserView - Added subdivision and wilaya for agent_subdivision")
                    except UserSubdivision.DoesNotExist:
                        user_data['subdivision'] = None
                        user_data['wilaya'] = None
                        logger.warning(f"CurrentUserView - User {user.id} (agent_subdivision) has no assigned subdivision")
            
            logger.info(f"CurrentUserView - Returning user data successfully")
            return Response(user_data)
        except Exception as e:
            logger.error(f"CurrentUserView - ERROR: {str(e)}", exc_info=True)
            logger.error(f"CurrentUserView - Exception type: {type(e).__name__}")
            logger.error(f"CurrentUserView - Request user: {request.user}")
            logger.error(f"CurrentUserView - Request META: {dict(request.META)}")
            # Re-raise to see the actual error
            raise





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
            logger.warning(f"Failed login attempt for email: {email}")
            return Response({
                "error": {
                    "code": "authentication_failed",
                    "message": "Identifiants incorrects",
                    "status_code": 401
                }
            }, status=status.HTTP_401_UNAUTHORIZED)



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


class TokenObtainPairView(BaseTokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    
    # @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))  # Temporarily disabled for MVP
    def post(self, request, *args, **kwargs):
        try:
            # DETECTIVE LOG: Token request received
            email = request.data.get('email')
            logger.info(f"🔐 [TOKEN] Token request received for email: {email}")
            print(f"[TOKEN] Login request for: {email}")
            
            response = super().post(request, *args, **kwargs)
            
            # DETECTIVE LOG: Token generated successfully
            logger.info(f"✅ [TOKEN] Token generated successfully")
            print(f"[TOKEN] Token generated successfully")
            
            if hasattr(response, 'data') and 'user' in response.data:
                user_data = response.data.get('user')
                logger.info(f"👤 [TOKEN] User in response: {user_data}")
                logger.info(f"🎭 [TOKEN] Role in response: {user_data.get('role')}")
                print(f"[TOKEN] User: {user_data}")
                print(f"[TOKEN] Role: {user_data.get('role')}")
            # The serializer already includes user data in the response
            return response
        except Exception as e:
            logger.error(f"❌ [TOKEN] TokenObtainPairView error: {str(e)}", exc_info=True)
            raise


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            logger.info(f"User {request.user.email} logged out successfully")
            return Response({"success": "Déconnexion réussie."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error during logout for user {request.user.email}: {str(e)}", exc_info=True)
            return Response({
                "error": {
                    "code": "logout_error",
                    "message": "Erreur lors de la déconnexion.",
                    "status_code": 400
                }
            }, status=status.HTTP_400_BAD_REQUEST)    


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
            try:
                wilaya_id = int(wilaya_id)
                if wilaya_id <= 0:
                    return SubDivision.objects.none()
                return SubDivision.objects.filter(wilaya__id=wilaya_id)
            except (ValueError, TypeError):
                return SubDivision.objects.none()
        return SubDivision.objects.none()

class communeByWilayaView(generics.ListAPIView):
    serializer_class = CommuneSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        wilaya_id = self.request.query_params.get('wilaya')
        if wilaya_id:
            try:
                wilaya_id = int(wilaya_id)
                if wilaya_id <= 0:
                    return Commune.objects.none()
                return Commune.objects.filter(subdivision__wilaya__id=wilaya_id)
            except (ValueError, TypeError):
                return Commune.objects.none()
        return Commune.objects.none()

class RoleList(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,GenericRolePermission]
    model_name = "Role"
    queryset = Role.objects.all()
    serializer_class = RoleSerializer






class CommunesBySubdivisionView(generics.ListAPIView):
    serializer_class = CommuneSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subdiv_id = self.request.query_params.get('subdivision')
        if subdiv_id:
            try:
                subdiv_id = int(subdiv_id)
                if subdiv_id <= 0:
                    return Commune.objects.none()
                return Commune.objects.filter(subdivision__id=subdiv_id)
            except (ValueError, TypeError):
                return Commune.objects.none()
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

        result_dict = defaultdict(list)

        for row in queryset:
            espece = row["espece__nom"]
            location = row[group_by]
            production = row["total_production"]

            if len(result_dict[espece]) < 3:
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
                    "total_sup_labouree": 0.0,
                    "total_sup_sinistree": 0.0,
                    "total_production": 0.0
                }

            stats[espece_name]["total_sup_labouree"] += parcelle.sup_labouree or 0
            stats[espece_name]["total_sup_sinistree"] += parcelle.sup_sinsitree or 0
            stats[espece_name]["total_production"] += parcelle.production or 0

        # Round values to two decimal places
        for values in stats.values():
            values["total_sup_labouree"] = round(values["total_sup_labouree"], 2)
            values["total_sup_sinistree"] = round(values["total_sup_sinistree"], 2)
            values["total_production"] = round(values["total_production"], 2)

        return Response(list(stats.values()))




class ExploitationWithParcelledList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Exploitation"
    serializer_class = ExploitationWithParcellesSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Exploitation.objects.all()
        role_nom = user.role.nom.lower()
        
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
            try:
                wilaya_id = int(wilaya_id)
                if wilaya_id > 0:
                    queryset = queryset.filter(commune__subdivision__wilaya__id=wilaya_id)
            except (ValueError, TypeError):
                pass
        
        if subdivision_id:
            try:
                subdivision_id = int(subdivision_id)
                if subdivision_id > 0:
                    queryset = queryset.filter(commune__subdivision__id=subdivision_id)
            except (ValueError, TypeError):
                pass
        
        if commune_id:
            try:
                commune_id = int(commune_id)
                if commune_id > 0:
                    queryset = queryset.filter(commune__id=commune_id)
            except (ValueError, TypeError):
                pass

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
                logger.warning(f"User {user.email} (agent_dsa) has no assigned wilaya")
                return Response({
                    "error": {
                        "code": "permission_denied",
                        "message": "Wilaya non assignée à cet utilisateur",
                        "status_code": 403
                    }
                }, status=status.HTTP_403_FORBIDDEN)

        elif role_name == "agent_subdivision":
            try:
                user_subdivision = UserSubdivision.objects.get(user=user).subdivision
                parcelles = parcelles.filter(
                    exploitation__commune__subdivision=user_subdivision
                )
            except UserSubdivision.DoesNotExist:
                logger.warning(f"User {user.email} (agent_subdivision) has no assigned subdivision")
                return Response({
                    "error": {
                        "code": "permission_denied",
                        "message": "Subdivision non assignée à cet utilisateur",
                        "status_code": 403
                    }
                }, status=status.HTTP_403_FORBIDDEN)

        grouped_stats = parcelles.values("espece__nom").annotate(
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

        return Response(data)

            

        
           





    

    




    



    


  