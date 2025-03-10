from django.db import models
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin, BaseUserManager
import datetime 
from django.utils import timezone
from safedelete.models import SafeDeleteModel
from safedelete.config import SOFT_DELETE


class CustomManager(BaseUserManager):
    def _create_user(self, nom, prenom, email, password , nom_role,subdivision=None, phoneNum=None,**extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)  # Ensuring users are active by default
        role,_=Role.objects.get_or_create(nom=nom_role)
        user = self.model(
            nom=nom,
            prenom=prenom,
            email=email,
            role=role,
            subdivision=subdivision,
            phoneNum=phoneNum,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db) 
        return user           



    def create_user(self, nom, prenom, email,subdivision, phoneNum=None,password=None, **extra_fields):
        if password is None:
            raise ValueError("the password must be set")
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(nom, prenom, email,password, nom_role="user",subdivision=subdivision, phoneNum=phoneNum, **extra_fields)



    def create_superuser(self, nom, prenom, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(nom, prenom, email,password,nom_role="admin", **extra_fields)



class SoftDeleteBaseModel(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    class Meta :
        abstract = True

class Espece (SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.nom


class Wilaya (SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True,unique=True)
    nom = models.CharField(unique=True,max_length=100)
    zone=models.CharField(max_length=500,null=True)
    
    def __str__(self):
        return  f"{self.nom}{self.zone} "



  
class SubDivision(SoftDeleteBaseModel):
    wilaya = models.ForeignKey(
        Wilaya, on_delete=models.PROTECT
    )
    id = models.AutoField(primary_key=True,unique=True)
    nom = models.CharField(max_length=100)
   
    def __str__(self):
         return  f"{self.nom}"

class Commune (SoftDeleteBaseModel):
    subdivision = models.ForeignKey(
       SubDivision , on_delete=models.PROTECT
    )
    id = models.AutoField(primary_key=True,unique=True)
    nom = models.CharField(max_length=100)
    def __str__(self):
         return  f"{self.nom}"

class Role (SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True) 
    nom= models.CharField(max_length=100)
  
    def __str__(self):
         return  self.nom 



class CustomUser(AbstractBaseUser,PermissionsMixin,SoftDeleteBaseModel):
    role = models.ForeignKey(
        Role , on_delete = models.PROTECT
    ) 
    subdivision = models.ForeignKey(
        SubDivision, on_delete = models.PROTECT,null=True, blank=True
    ) 
    nom = models.CharField(max_length=15)
    prenom = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    phoneNum = models.IntegerField(null=True, blank=True)
    createDate = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = CustomManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom", "prenom"]

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.email}"     

class Agriculteur(SoftDeleteBaseModel):
    utilisateur = models.ForeignKey(
        CustomUser, on_delete=models.PROTECT,default=1
    ) 
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    num_tel = models.CharField(max_length=11, unique=True)  
    numero_carte_fellah = models.CharField(max_length=50, unique=True,null=True, blank=True)  

    def __str__(self):  
        return f"{self.nom} {self.prenom}"


class Objectif(SoftDeleteBaseModel):
    wilaya = models.ForeignKey(
        Wilaya , on_delete = models.PROTECT
    )
    espece = models.ForeignKey(
        Espece , on_delete = models.PROTECT
    )
    utilisateur = models.ForeignKey(
        CustomUser, on_delete=models.PROTECT,default=1
    )
    annee = models.DateTimeField()
    id=models.AutoField(primary_key=True)
    objectif_production = models.FloatField()

     
class Exploitation(SoftDeleteBaseModel):
    commune = models.ForeignKey(
        Commune, on_delete=models.PROTECT
    )
    agriculteur= models.ForeignKey(
        Agriculteur, on_delete=models.PROTECT
    )
    utilisateur = models.ForeignKey(
        CustomUser, on_delete=models.PROTECT,default=1
    )
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    lieu= models.CharField(max_length=100)
    situation=models.CharField(max_length=500)
    longtitude = models.FloatField(default=0)
    latitude = models.FloatField(default=0)
    def __str__(self):
        return self.nom



class Parcelle(SoftDeleteBaseModel):
    exploitation = models.ForeignKey(
        Exploitation, on_delete=models.PROTECT
    )
    espece = models.ForeignKey(
       Espece ,on_delete=models.PROTECT
    )
    annee = models.DateTimeField()
    id = models.AutoField(primary_key=True)
    date_creation = models.DateTimeField()
    date_modification = models.DateTimeField()
    superficie =models.FloatField()
    sup_labouree = models.FloatField()
    sup_emblavee = models.FloatField()
    sup_sinsitree = models.FloatField()
    sup_recoltee = models.FloatField()
    production = models.FloatField()

    def __str__(self):
        return f"{self.exploitation} {self.espece} {self.annee}"
        
    





