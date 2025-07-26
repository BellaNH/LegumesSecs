from .models import *
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import *




class EspeceSerializer(serializers.ModelSerializer):
    class Meta :
        model = Espece
        fields = "__all__"


class WilayaSerializer(serializers.ModelSerializer):
    
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

    class Meta:
        model = Objectif
        fields = "__all__"


class SubDivisionSerializer(serializers.ModelSerializer):
    wilaya_id = serializers.PrimaryKeyRelatedField(
        queryset=Wilaya.objects.all(), source='wilaya', write_only=True
    )
    wilaya = WilayaSerializer(read_only=True)
    class Meta :
        model = SubDivision
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta :
        model = Role
        fields = "__all__"

class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permissions
        fields = ['model', 'create', 'retrieve', 'update', 'destroy']
     

class CustomUserSerializer(serializers.ModelSerializer):   
    permissions = PermissionsSerializer(many=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source='role', write_only=True
    )
    role= RoleSerializer(read_only=True)
    password = serializers.CharField(write_only=True) 
    wilaya = serializers.IntegerField(write_only=True, required=False,allow_null=True)
    subdivision = serializers.IntegerField(write_only=True, required=False,allow_null=True)
    class Meta:
        model = CustomUser
        fields = ["id",'nom','prenom','email','password','phoneNum','role','role_id','permissions', 'wilaya', 'subdivision']
    def validate(self, attrs):

        attrs['wilaya'] = self.initial_data.get('wilaya', None)
        attrs['subdivision'] = self.initial_data.get('subdivision', None)
        print(self.initial_data)
        return attrs   

    def create(self, validated_data):
        permissions_data = validated_data.pop('permissions')
        final_permissions = build_permissions(permissions_data)
        wilaya_id = validated_data.pop('wilaya',None)
        subdiv_id = validated_data.pop('subdivision',None)
        role =  RoleSerializer(read_only=True)
        password = validated_data.pop("password", None)
        user = CustomUser(**validated_data)
        if password:
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
        permissions_data = validated_data.pop('permissions', [])
        final_permissions = build_permissions(permissions_data)
        wilaya_id = validated_data.pop('wilaya', None)
        subdivision_id = validated_data.pop('subdivision', None)

        new_role = validated_data.get('role')
        old_role_id = instance.role.id
      
        for attr, value in validated_data.items():
            if attr == 'password' and value:
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()

        instance.permissions.all().delete()
        for perm_data in final_permissions:
            Permissions.objects.create(user=instance, **perm_data)
        if old_role_id == 3 and new_role.id == 4:
            UserWilaya.objects.filter(user=instance).delete()

            if subdivision_id is not None:

                UserSubdivision.objects.update_or_create(
                    user=instance,
                    defaults={'subdivision_id': subdivision_id}
                )

        elif old_role_id == 4 and new_role.id == 3:
            UserSubdivision.objects.filter(user=instance).delete()

            if wilaya_id is not None:
                UserWilaya.objects.update_or_create(
                    user=instance,
                    defaults={'wilaya_id': wilaya_id}
                )

        elif new_role.id == 3:
            if wilaya_id is not None:
                UserWilaya.objects.update_or_create(
                    user=instance,
                    defaults={'wilaya_id': wilaya_id}
            )
            UserSubdivision.objects.filter(user=instance).delete()

        elif new_role.id == 4:
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








class UserSerializer(serializers.ModelSerializer):
    permissions = PermissionsSerializer(many=True)
    role= RoleSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = [
            'id', 'nom','prenom','role','phoneNum','email','role','permissions'
        ]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("Email ou mot de passe invalide")

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
            token['role'] = user.role  # ou nom_role si tu préfères
            return token 
    User = get_user_model()


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
        source='subdivision', write_only=True,required=False
    )
    subdivision = SubDivisionSerializer(read_only=True)

    class Meta:
        model = Commune
        fields = "__all__"


class ExploitationSerializer(serializers.ModelSerializer):
    commune = CommuneSerializer(read_only=True)
    commune_id = serializers.PrimaryKeyRelatedField(
        queryset=Commune.objects.all(), source='commune', write_only=True
    )

    class Meta :
        model = Exploitation
        fields = "__all__"


class ParcelleSerializer(serializers.ModelSerializer):
    espece = EspeceSerializer(read_only=True)  # For nested read
    espece_id = serializers.PrimaryKeyRelatedField(  # For write operations
        source='espece',
        queryset=Espece.objects.all(),
        write_only=True
    )
    class Meta :
        model = Parcelle
        fields = "__all__"
    exploitation  = serializers.PrimaryKeyRelatedField(
        queryset= Exploitation.objects.all(), write_only=True)
    def create(self, validated_data):
        fields = [
            'superficie',
            'sup_labouree',
            'sup_emblavee',
            'sup_sinsitree',
            'sup_recoltee',
        ]

        
        for field in ['sup_labouree','sup_emblavee','sup_sinsitree','sup_recoltee']:
            value = validated_data.get(field)
            if value > validated_data.get('superficie'):
                raise serializers.ValidationError({field: f"{field} doit etre inferieur ou egale a la superficie totale"})
        
        exploitation = validated_data.get('exploitation')
        if (validated_data.get('superficie') > exploitation.superficie):
            raise serializers.ValidationError("la superficie de la parcelle doit etre inferieur ou egale a la superficie totale de l'exploitation")


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
       




