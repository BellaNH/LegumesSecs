from .models import *
from rest_framework import serializers



class EspeceSerializer(serializers.ModelSerializer):
    class Meta :
        model = Espece
        fields = "__all__"


class AgriculteurSerializer(serializers.ModelSerializer):
    class Meta :
        model = Agriculteur
        fields = "__all__"


class WilayaSerializer(serializers.ModelSerializer):
    class Meta :
        model = Wilaya
        fields = "__all__"




class ObjectifSerializer(serializers.ModelSerializer):
    class Meta :
        model = Objectif
        fields = "__all__"



class SubDivisionSerializer(serializers.ModelSerializer):
    class Meta :
        model = SubDivision
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta :
        model = Role
        fields = "__all__"



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta :
        model = CustomUser
        fields = "__all__"




class CommuneSerializer(serializers.ModelSerializer):
    class Meta :
        model = Commune
        fields = "__all__"



class ExploitationSerializer(serializers.ModelSerializer):
    class Meta :
        model = Exploitation
        fields = "__all__"


class ParcelleSerializer(serializers.ModelSerializer):
    class Meta :
        model = Parcelle
        fields = "__all__"






