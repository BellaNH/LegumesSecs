from .models import *


def get_espece(self):
        data = Espece.objects.all()
        if self.role.nom in ['agent_central','admin']:
            return data
        if self.role.nom == 'agent_dsa':
            return data.filter(subdivision__wilaya=self.subdivision.wilaya)
        if self.role.nom == 'agent_subdivision':
            return data.filter(subdivision=self.subdivision)



def get_agriculteur(self):
        data = Agriculteur.objects.all()
        if self.role.nom in ['agent_central','admin']:
            return data
        if self.role.nom == 'agent_dsa':
            return data.filter(subdivision__wilaya=self.subdivision.wilaya)
        if self.role.nom == 'agent_subdivision':
            return data.filter(subdivision=self.subdivision)

def get_wilayas(self):
        data = Wilaya.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom in ['agent_dsa','agent_subdivision']:
            return self.subdivision.wilaya

def get_objectif(self):
        data = Objectif.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom in ['agent_dsa','agent_subdivision']:
            return data.filter(subdivision__wilaya=self.subdivision.wilaya)

def get_subdivisions(self):
        data = SubDivision.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom == 'agent_dsa':
            return data.filter(wilaya=self.subdivision.wilaya)
        elif self.role.nom == 'agent_subdivision':
            return self.subdivision



def get_users(self):
        data = CustomUser.objects.exclude()
        if self.role.nom == 'admin':
            return data
        elif self.role.nom in ['agent_central','agent_dsa','agent_subdivision']:
            return self



def get_communes(self):
        data = Commune.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom  == 'agent_dsa':
            return data.filter(subdivision__wilaya=self.subdivision.wilaya)
        elif self.role.nom == 'agent_subdivision':
            return data.filter(subdivision=self.subdivision)

def get_exploitation(self):
        data = Exploitation.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom == 'agent_dsa':
            return data.filter(Commune__SubDivision__wilaya=self.subdivision.wilaya)
        elif self.role.nom == 'agent_subdivision':
            return data.filter(Commune__SubDivision=self.subdivision)

def get_parcelle(self):
        data = Parcelle.objects.all()
        if self.role.nom in ['admin','agent_central']:
            return data
        elif self.role.nom == 'agent_dsa':
            return data.filter(Exploitation__Commune__SubDivision__wilaya=self.subdivision.wilaya)
        elif self.role.nom == 'agent_subdivision':
            return data.filter(Exploitation__Commune__SubDivision=self.subdivision)




    

















