from django.db import models
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin, BaseUserManager
import datetime 
from django.utils import timezone
from safedelete.models import SafeDeleteModel
from safedelete.config import SOFT_DELETE


class CustomManager(BaseUserManager):
    def _create_user(self, nom, prenom, email, password , nom_role, phoneNum,**extra_fields):      
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)  # Ensuring users are active by default
        role,_=Role.objects.get_or_create(nom=nom_role)
        

        user = self.model(
            nom=nom,
            prenom=prenom,
            email=email,
            role=role,
            phoneNum=phoneNum,
            **extra_fields
        )
        print(f"{user.password}")
        user.set_password(password)
        print(f"{user.password}")
        user.save(using=self._db)

                  



    def create_user(self, nom, prenom, email,phoneNum,password=None, **extra_fields):
        if password is None:
            raise ValueError("the password must be set")
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(nom=nom, prenom=prenom, email=email,password=password, nom_role="user", phoneNum=phoneNum, **extra_fields)



    def create_superuser(self, nom, prenom, email,phoneNum=None,password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        
        return self._create_user(nom, prenom, email,password,nom_role="admin",phoneNum=phoneNum, **extra_fields)





class SoftDeleteBaseModel(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    class Meta :
        abstract = True

class Espece (SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom


class Wilaya (SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True,unique=True)
    nom = models.CharField(unique=True,max_length=100)

    
    def __str__(self):
        return  f"{self.nom} "



  
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
    nom = models.CharField(max_length=15,null=False, blank=False)
    prenom = models.CharField(max_length=15,null=False, blank=False)
    email = models.EmailField(unique=True,null=False, blank=False)
    phoneNum = models.IntegerField(null=True, blank=True, unique=True)
    createDate = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = CustomManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom", "prenom","phoneNum"]

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.email}"     


class Permissions(SoftDeleteBaseModel):
    user = models.ForeignKey(
        CustomUser, on_delete = models.PROTECT,related_name='permissions'
    )
    model = models.CharField(max_length=15)
    create = models.BooleanField(default=False)
    retrieve = models.BooleanField(default=False)
    update = models.BooleanField(default=False)
    destroy = models.BooleanField(default=False)


class UserWilaya(SoftDeleteBaseModel):
    wilaya = models.ForeignKey(
        Wilaya,on_delete=models.CASCADE
    )
    user = models.OneToOneField(
        CustomUser,on_delete=models.CASCADE
    )

class UserSubdivision(SoftDeleteBaseModel):
    subdivision = models.ForeignKey(
        SubDivision,on_delete=models.CASCADE
    )
    user = models.OneToOneField(
        CustomUser,on_delete=models.CASCADE
    )

class Agriculteur(SoftDeleteBaseModel):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    phoneNum = models.IntegerField(unique=True)  
    numero_carte_fellah = models.IntegerField(unique=True,null=True, blank=True)  

    def __str__(self):  
        return f"{self.nom} {self.prenom}"


class Objectif(SoftDeleteBaseModel):
    wilaya = models.ForeignKey(
        Wilaya , on_delete = models.PROTECT
    )
    espece = models.ForeignKey(
        Espece , on_delete = models.PROTECT
    )
    annee = models.IntegerField()
    id=models.AutoField(primary_key=True)
    objectif_production = models.FloatField()

     
class Exploitation(SoftDeleteBaseModel):
    commune = models.ForeignKey(
        Commune, on_delete=models.PROTECT
    )
    agriculteur= models.ForeignKey(
        Agriculteur, on_delete=models.PROTECT,related_name='exploitations'
    )

    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    lieu= models.CharField(max_length=100)
    superficie = models.FloatField(blank=False,null=False)
    situation=models.CharField(max_length=500)
    longtitude = models.FloatField(blank=False,null=False)
    latitude = models.FloatField(blank=False,null=False)
    def __str__(self):
        return self.nom



class Parcelle(SoftDeleteBaseModel):
    exploitation = models.ForeignKey(
        Exploitation, on_delete=models.PROTECT
    )
    espece = models.ForeignKey(
       Espece ,on_delete=models.PROTECT
    )
    annee = models.IntegerField()
    id = models.AutoField(primary_key=True)
    date_creation = models.DateTimeField(default=timezone.now)
    superficie = models.FloatField()
    sup_labouree = models.FloatField(null=True,blank=True)
    sup_emblavee = models.FloatField(null=True,blank=True)
    sup_sinsitree = models.FloatField(null=True,blank=True)
    sup_recoltee = models.FloatField(null=True,blank=True)
    sup_deserbee = models.FloatField(null=True,blank=True)
    prev_de_production = models.FloatField(null=True,blank=True)
    production = models.FloatField(null=True,blank=True)
    engrais_de_fond = models.FloatField(null=True,blank=True)
    engrais_de_couverture = models.FloatField(null=True,blank=True)

    def __str__(self):
        return f"{self.exploitation} {self.espece} {self.annee}"

        
    





