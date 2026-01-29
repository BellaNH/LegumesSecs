from .models import *
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import *
from .validators import (
    validate_phone_number, validate_email_format, validate_positive_decimal,
    validate_decimal_range, validate_year, validate_latitude, validate_longitude,
    sanitize_string, validate_text_length, validate_password_strength
)
from decimal import Decimal




class EspeceSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(max_length=100, required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom de l'espèce")
        if not value:
            raise serializers.ValidationError("Le nom de l'espèce est requis.")
        return value
    
    class Meta :
        model = Espece
        fields = "__all__"


class WilayaSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(max_length=100, required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom de la wilaya")
        if not value:
            raise serializers.ValidationError("Le nom de la wilaya est requis.")
        return value
    
    class Meta :
        model = Wilaya
        fields = "__all__"


class ObjectifSerializer(serializers.ModelSerializer):
    wilaya = WilayaSerializer(read_only=True)
    espece = EspeceSerializer(read_only=True)
    espece_id = serializers.PrimaryKeyRelatedField(
        queryset=Espece.objects.all(),
        source='espece',
        write_only=True
    )
    wilaya_id = serializers.PrimaryKeyRelatedField(
        queryset=Wilaya.objects.all(),
        source='wilaya',
        write_only=True
    )
    annee = serializers.IntegerField(required=True)
    objectif_production = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)

    def validate_annee(self, value):
        validate_year(value)
        return value
    
    def validate_objectif_production(self, value):
        validate_positive_decimal(value, "L'objectif de production")
        validate_decimal_range(value, min_value=Decimal('0'), max_value=Decimal('99999999.99'), field_name="L'objectif de production")
        return value

    class Meta:
        model = Objectif
        fields = "__all__"


class SubDivisionSerializer(serializers.ModelSerializer):
    wilaya_id = serializers.PrimaryKeyRelatedField(
        queryset=Wilaya.objects.all(), source='wilaya', write_only=True
    )
    wilaya = WilayaSerializer(read_only=True)
    nom = serializers.CharField(max_length=100, required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom de la subdivision")
        if not value:
            raise serializers.ValidationError("Le nom de la subdivision est requis.")
        return value
    
    class Meta :
        model = SubDivision
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(max_length=100, required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom du rôle")
        if not value:
            raise serializers.ValidationError("Le nom du rôle est requis.")
        return value
    
    class Meta :
        model = Role
        fields = "__all__"

class PermissionsSerializer(serializers.ModelSerializer):
    model = serializers.CharField(max_length=15, required=True)
    
    def validate_model(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 15, "Le nom du modèle")
        if not value:
            raise serializers.ValidationError("Le nom du modèle est requis.")
        return value
    
    class Meta:
        model = Permissions
        fields = ['model', 'create', 'retrieve', 'update', 'destroy']
     

class CustomUserSerializer(serializers.ModelSerializer):   
    permissions = PermissionsSerializer(many=True, required=False, allow_empty=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source='role', write_only=True
    )
    role= RoleSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    nom = serializers.CharField(max_length=15, required=True)
    prenom = serializers.CharField(max_length=15, required=True)
    email = serializers.EmailField(required=True)
    phoneNum = serializers.IntegerField(required=False, allow_null=True)
    wilaya = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    subdivision = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 15, "Le nom")
        if not value:
            raise serializers.ValidationError("Le nom est requis.")
        return value
    
    def validate_prenom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 15, "Le prénom")
        if not value:
            raise serializers.ValidationError("Le prénom est requis.")
        return value
    
    def validate_email(self, value):
        validate_email_format(value)
        return value.lower().strip()
    
    def validate_phoneNum(self, value):
        if value is not None:
            validate_phone_number(value)
        return value
    
    def validate_password(self, value):
        if value and value.strip():
            validate_password_strength(value)
        return value
    
    def validate(self, attrs):
        attrs['wilaya'] = self.initial_data.get('wilaya', None)
        attrs['subdivision'] = self.initial_data.get('subdivision', None)
        # Handle permissions if it's an empty string or missing
        if 'permissions' not in attrs or not attrs.get('permissions') or attrs.get('permissions') == "":
            attrs['permissions'] = []
        return attrs   

    def create(self, validated_data):
        permissions_data = validated_data.pop('permissions', [])
        # Handle empty string or None
        if not permissions_data or permissions_data == "":
            permissions_data = []
        # Ensure it's a list
        if not isinstance(permissions_data, list):
            permissions_data = []
        final_permissions = build_permissions(permissions_data)
        wilaya_id = validated_data.pop('wilaya', None)
        subdiv_id = validated_data.pop('subdivision', None)
        password = validated_data.pop("password", None)
        
        if not password:
            raise serializers.ValidationError({"password": "Le mot de passe est requis lors de la création."})
        
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        for perm_data in final_permissions:
            Permissions.objects.create(user=user, **perm_data)
        if user.role.id == 3 and wilaya_id is not None:
            UserWilaya.objects.create(
                wilaya_id=wilaya_id,
                user=user
            )
        if user.role.id == 4 and subdiv_id is not None:
            UserSubdivision.objects.create(
                subdivision_id=subdiv_id,
                user=user
            )
        return user

    def update(self, instance, validated_data):
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # Check if permissions were explicitly provided in the request
            # (not just set to [] by validate method)
            permissions_provided = 'permissions' in self.initial_data
            permissions_data = validated_data.pop('permissions', [])
            
            wilaya_id = validated_data.pop('wilaya', None)
            subdivision_id = validated_data.pop('subdivision', None)

            # Get new_role if role_id was provided, otherwise use existing role
            new_role = validated_data.pop('role', None)
            old_role_id = instance.role.id
            new_role_id = new_role.id if new_role else old_role_id
          
            # Update basic fields (excluding password which is handled separately)
            for attr, value in validated_data.items():
                if attr == 'password' and value:
                    instance.set_password(value)
                else:
                    setattr(instance, attr, value)

            instance.save()

            # Only update permissions if they were explicitly provided in the request
            if permissions_provided:
                final_permissions = build_permissions(permissions_data)
                instance.permissions.all().delete()
                for perm_data in final_permissions:
                    Permissions.objects.create(user=instance, **perm_data)
            
            # Only update role-related associations if role actually changed
            if new_role and old_role_id != new_role_id:
                if old_role_id == 3 and new_role_id == 4:
                    UserWilaya.objects.filter(user=instance).delete()

                    if subdivision_id is not None:
                        UserSubdivision.objects.update_or_create(
                            user=instance,
                            defaults={'subdivision_id': subdivision_id}
                        )

                elif old_role_id == 4 and new_role_id == 3:
                    UserSubdivision.objects.filter(user=instance).delete()

                    if wilaya_id is not None:
                        UserWilaya.objects.update_or_create(
                            user=instance,
                            defaults={'wilaya_id': wilaya_id}
                        )

                elif new_role_id == 3:
                    if wilaya_id is not None:
                        UserWilaya.objects.update_or_create(
                            user=instance,
                            defaults={'wilaya_id': wilaya_id}
                        )
                    UserSubdivision.objects.filter(user=instance).delete()

                elif new_role_id == 4:
                    if subdivision_id is not None:
                        UserSubdivision.objects.update_or_create(
                            user=instance,
                            defaults={'subdivision_id': subdivision_id}
                        )
                    UserWilaya.objects.filter(user=instance).delete()

                else:
                    UserWilaya.objects.filter(user=instance).delete()
                    UserSubdivision.objects.filter(user=instance).delete()
            else:
                # Role didn't change, but wilaya/subdivision might have been updated
                if old_role_id == 3:
                    if wilaya_id is not None:
                        UserWilaya.objects.update_or_create(
                            user=instance,
                            defaults={'wilaya_id': wilaya_id}
                        )
                    UserSubdivision.objects.filter(user=instance).delete()
                elif old_role_id == 4:
                    if subdivision_id is not None:
                        UserSubdivision.objects.update_or_create(
                            user=instance,
                            defaults={'subdivision_id': subdivision_id}
                        )
                    UserWilaya.objects.filter(user=instance).delete()
                else:
                    UserWilaya.objects.filter(user=instance).delete()
                    UserSubdivision.objects.filter(user=instance).delete()

            return instance
            
        except Exception as e:
            # Log the error with full details
            error_details = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'user_id': instance.id if instance else None,
                'validated_data_keys': list(validated_data.keys()),
                'initial_data_keys': list(self.initial_data.keys()) if hasattr(self, 'initial_data') else [],
            }
            logger.error(f"Error updating user {instance.id if instance else 'unknown'}: {error_details}", exc_info=True)
            
            # Return a proper ValidationError with useful message
            error_msg = f"Erreur lors de la mise à jour: {str(e)}"
            if hasattr(e, '__cause__') and e.__cause__:
                error_msg += f" (Cause: {str(e.__cause__)})"
            
            raise serializers.ValidationError({
                'non_field_errors': [error_msg],
                'error_details': error_details
            })








class UserSerializer(serializers.ModelSerializer):
    permissions = PermissionsSerializer(many=True)
    role = RoleSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = [
            'id', 'nom', 'prenom', 'role', 'phoneNum', 'email', 'permissions'
        ]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("L'email est requis.")
        validate_email_format(value)
        return value.lower().strip()
    
    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Le mot de passe est requis.")
        if len(value) < 1:
            raise serializers.ValidationError("Le mot de passe ne peut pas être vide.")
        return value

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email et mot de passe sont requis.")

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("Email ou mot de passe invalide")
        
        if not user.is_active:
            raise serializers.ValidationError("Ce compte utilisateur est désactivé.")

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'nom': user.nom,
                'email': user.email,
                'role': user.role.nom if user.role else None,
            }
        }
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role.nom if user.role else None
        return token


class UserWilayaSerializer(serializers.ModelSerializer):
    wilaya = serializers.PrimaryKeyRelatedField(
        queryset=Wilaya.objects.all()
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )
    class Meta :
        model = UserWilaya
        fields = "__all__"


class UserSubdivSerializer(serializers.ModelSerializer):
    subdivision = serializers.PrimaryKeyRelatedField(
        queryset=SubDivision.objects.all()
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )
    class Meta :
        model = UserSubdivision
        fields = "__all__"



class CommuneSerializer(serializers.ModelSerializer):
    subdiv_id = serializers.PrimaryKeyRelatedField(
        queryset=SubDivision.objects.all(), 
        source='subdivision', write_only=True, required=False
    )
    subdivision = SubDivisionSerializer(read_only=True)
    nom = serializers.CharField(max_length=100, required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom de la commune")
        if not value:
            raise serializers.ValidationError("Le nom de la commune est requis.")
        return value

    class Meta:
        model = Commune
        fields = "__all__"


class ExploitationSerializer(serializers.ModelSerializer):
    commune = CommuneSerializer(read_only=True)
    commune_id = serializers.PrimaryKeyRelatedField(
        queryset=Commune.objects.all(), source='commune', write_only=True
    )
    nom = serializers.CharField(max_length=100, required=True)
    lieu = serializers.CharField(max_length=100, required=True)
    superficie = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    situation = serializers.CharField(max_length=500, required=True)
    longtitude = serializers.FloatField(required=True)
    latitude = serializers.FloatField(required=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom de l'exploitation")
        if not value:
            raise serializers.ValidationError("Le nom de l'exploitation est requis.")
        return value
    
    def validate_lieu(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le lieu")
        if not value:
            raise serializers.ValidationError("Le lieu est requis.")
        return value
    
    def validate_situation(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 500, "La situation")
        return value
    
    def validate_superficie(self, value):
        validate_positive_decimal(value, "La superficie")
        validate_decimal_range(value, min_value=Decimal('0'), max_value=Decimal('99999999.99'), field_name="La superficie")
        return value
    
    def validate_latitude(self, value):
        validate_latitude(value)
        return value
    
    def validate_longtitude(self, value):
        validate_longitude(value)
        return value

    class Meta :
        model = Exploitation
        fields = "__all__"


class ParcelleSerializer(serializers.ModelSerializer):
    espece = EspeceSerializer(read_only=True)
    espece_id = serializers.PrimaryKeyRelatedField(
        source='espece',
        queryset=Espece.objects.all(),
        write_only=True
    )
    exploitation = serializers.PrimaryKeyRelatedField(
        queryset=Exploitation.objects.all(), write_only=True
    )
    annee = serializers.IntegerField(required=True)
    superficie = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    sup_labouree = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    sup_emblavee = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    sup_sinsitree = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    sup_recoltee = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    sup_deserbee = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    prev_de_production = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    production = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    engrais_de_fond = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    engrais_de_couverture = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    
    def validate_annee(self, value):
        validate_year(value)
        return value
    
    def validate_superficie(self, value):
        validate_positive_decimal(value, "La superficie")
        validate_decimal_range(value, min_value=Decimal('0'), max_value=Decimal('99999999.99'), field_name="La superficie")
        return value
    
    def validate_sup_labouree(self, value):
        validate_positive_decimal(value, "La superficie labourée")
        return value
    
    def validate_sup_emblavee(self, value):
        validate_positive_decimal(value, "La superficie emblavée")
        return value
    
    def validate_sup_sinsitree(self, value):
        validate_positive_decimal(value, "La superficie sinistrée")
        return value
    
    def validate_sup_recoltee(self, value):
        validate_positive_decimal(value, "La superficie récoltée")
        return value
    
    def validate_sup_deserbee(self, value):
        validate_positive_decimal(value, "La superficie désherbée")
        return value
    
    def validate_prev_de_production(self, value):
        validate_positive_decimal(value, "La prévision de production")
        return value
    
    def validate_production(self, value):
        validate_positive_decimal(value, "La production")
        return value
    
    def validate_engrais_de_fond(self, value):
        validate_positive_decimal(value, "L'engrais de fond")
        return value
    
    def validate_engrais_de_couverture(self, value):
        validate_positive_decimal(value, "L'engrais de couverture")
        return value
    
    def validate(self, attrs):
        superficie = attrs.get('superficie')
        exploitation = attrs.get('exploitation')
        
        if exploitation and superficie:
            if superficie > exploitation.superficie:
                raise serializers.ValidationError({
                    'superficie': "La superficie de la parcelle doit être inférieure ou égale à la superficie totale de l'exploitation."
                })
        
        surface_fields = {
            'sup_labouree': attrs.get('sup_labouree'),
            'sup_emblavee': attrs.get('sup_emblavee'),
            'sup_sinsitree': attrs.get('sup_sinsitree'),
            'sup_recoltee': attrs.get('sup_recoltee'),
            'sup_deserbee': attrs.get('sup_deserbee'),
        }
        
        for field_name, field_value in surface_fields.items():
            if field_value and superficie and field_value > superficie:
                raise serializers.ValidationError({
                    field_name: f"La {field_name.replace('_', ' ')} doit être inférieure ou égale à la superficie totale."
                })
        
        return attrs
    
    class Meta :
        model = Parcelle
        fields = "__all__"
    
    def create(self, validated_data):
        return super().create(validated_data)
class ExploitationNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exploitation
        fields = ['id', 'nom']

class AgriculteurSerializer(serializers.ModelSerializer):
    commune = serializers.SerializerMethodField()
    subdivision = serializers.SerializerMethodField()
    wilaya = serializers.SerializerMethodField()
    exploitation = serializers.SerializerMethodField()
    nom = serializers.CharField(max_length=100, required=True)
    prenom = serializers.CharField(max_length=100, required=True)
    phoneNum = serializers.IntegerField(required=True)
    numero_carte_fellah = serializers.IntegerField(required=False, allow_null=True)
    
    def validate_nom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le nom")
        if not value:
            raise serializers.ValidationError("Le nom est requis.")
        return value
    
    def validate_prenom(self, value):
        value = sanitize_string(value)
        validate_text_length(value, 100, "Le prénom")
        if not value:
            raise serializers.ValidationError("Le prénom est requis.")
        return value
    
    def validate_phoneNum(self, value):
        validate_phone_number(value)
        return value
    
    def validate_numero_carte_fellah(self, value):
        if value is not None:
            if value < 0:
                raise serializers.ValidationError("Le numéro de carte fellah doit être positif.")
        return value

    class Meta:
        model = Agriculteur
        fields = [
            'id', 'nom', 'prenom', 'phoneNum', 'numero_carte_fellah',
            'commune', 'subdivision', 'wilaya',
            'exploitation'  
        ]

    def get_commune(self, obj):
        exploitation = obj.exploitations.filter(deleted__isnull=True).first()
        if exploitation:
            return {"id": exploitation.commune.id, "nom": exploitation.commune.nom}
        return None

    def get_subdivision(self, obj):
        exploitation = obj.exploitations.filter(deleted__isnull=True).first()
        if exploitation:
            subdivision = exploitation.commune.subdivision
            return {"id": subdivision.id, "nom": subdivision.nom}
        return None

    def get_wilaya(self, obj):
        exploitation = obj.exploitations.filter(deleted__isnull=True).first()
        if exploitation:
            wilaya = exploitation.commune.subdivision.wilaya
            return {"id": wilaya.id, "nom": wilaya.nom}
        return None

    def get_exploitation(self, obj):
        exploitation = obj.exploitations.filter(deleted__isnull=True).first()
        if exploitation:
            return {"id": exploitation.id, "nom": exploitation.nom}
        return None




class ExploitationWithParcellesSerializer(serializers.ModelSerializer):
    parcelles = ParcelleSerializer(many=True, read_only=True, source='parcelle_set')
    wilaya = WilayaSerializer(read_only=True)
    
    subdivision = SubDivisionSerializer(read_only=True)
    
    commune = CommuneSerializer(read_only=True)
    
    agriculteur = AgriculteurSerializer(read_only=True)
    
    class Meta:
        model = Exploitation
        fields = "__all__"
       




