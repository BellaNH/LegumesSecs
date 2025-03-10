from rest_framework import generics
from .models import *
from .serializers import *
from .scoping import *
from .permissions import CustomPermission



class EspeceList(generics.ListCreateAPIView):
    queryset = Espece.objects.all()
    serializer_class = EspeceSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_espece(user)
    
    

class EspeceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Espece.objects.all()
    serializer_class = EspeceSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_espece(user)
    
    


class AgriculteurList(generics.ListCreateAPIView):
    queryset = Agriculteur.objects.all()
    serializer_class = AgriculteurSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_agriculteur(user)
    

class AgriculteurDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Agriculteur.objects.all()
    serializer_class = AgriculteurSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_agriculteur(user)
    



class WilayaList(generics.ListCreateAPIView):
    queryset =  Wilaya.objects.all()
    serializer_class = WilayaSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_wilayas(user)
    

class WilayaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_wilayas(user)
    


class ObjectifList(generics.ListCreateAPIView):
    queryset = Objectif.objects.all()
    serializer_class = ObjectifSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_objectif(user)
    

class ObjectifDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Objectif.objects.all()
    serializer_class = ObjectifSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_objectif(user)
    



class SubDivisionList(generics.ListCreateAPIView):
    queryset = SubDivision.objects.all()
    serializer_class = SubDivisionSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_subdivisions(user)
    

class SubDivisionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubDivision.objects.all()
    serializer_class = SubDivisionSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_subdivisions(user)



class RoleList(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [CustomPermission]
    

class RoleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [CustomPermission]



class CustomUserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_users(user)
    

class CustomUserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_users(user)



class CommuneList(generics.ListCreateAPIView):
    queryset = Commune.objects.all()
    serializer_class = CommuneSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_communes(user)
    

class CommuneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Commune.objects.all()
    serializer_class = CommuneSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_communes(user)
    


class ExploitationList(generics.ListCreateAPIView):
    queryset = Exploitation.objects.all()
    serializer_class = ExploitationSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_exploitation(user)
    

class ExploitationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exploitation.objects.all()
    serializer_class = ExploitationSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_exploitation(user)
    


class ParcelleList(generics.ListCreateAPIView):
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_parcelle(user)
    

class ParcelleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer
    permission_classes = [CustomPermission]
    def get_queryset(self):
        user = self.request.user
        return get_parcelle(user)



    

    




    



    


  