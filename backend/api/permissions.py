from rest_framework.permissions import BasePermission,SAFE_METHODS



class CustomPermission(BasePermission):
    def has_permission(self,request,view):
        user = request.user
        model_name = view.get_queryset().model.__name__.lower()
        permissions={
            "espece":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve"],
                "agent_dsa":["retrieve"],
                "agent_subdivision":["retrieve"],
            },
            "wilaya":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve"],
                "agent_dsa":["retrieve"],
                "agent_subdivision":["retrieve"],
            },
            "subdivision":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve"],
                "agent_dsa":["retrieve"],
                "agent_subdivision":["retrieve"],
            },
            "commune":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve"],
                "agent_dsa":["retrieve"],
                "agent_subdivision":["retrieve"],
            },
            "role":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve"],
                "agent_dsa":["retrieve"],
                "agent_subdivision":["retrieve"],
            },
            "customuser":{
                "admin":["create","retrieve","update","destroy"],
                "agent_central":["retrieve","update"],
                "agent_dsa":["retrieve","update"],
                "agent_subdivision":["retrieve","update"],
            },
            "agriculteur":{
                "admin":["retrieve"],
                "agent_central":["retrieve"],
                "agent_dsa":["create","retrieve","update","destroy"],
                "agent_subdivision":["create","retrieve","update","destroy"],
            },
            "objectif":{
                "admin":["retrieve"],
                "agent_central":["retrieve"],
                "agent_dsa":["create","retrieve","update","destroy"],
                "agent_subdivision":["retrieve"],
            },
            "exploitation":{
                "admin":["retrieve"],
                "agent_central":["retrieve"],
                "agent_dsa":["create","retrieve","update","destroy"],
                "agent_subdivision":["create","retrieve","update","destroy"],
            },
            "parcelle":{
                "admin":["retrieve"],
                "agent_central":["retrieve"],
                "agent_dsa":["create","retrieve","update","destroy"],
                "agent_subdivision":["create","retrieve","update","destroy"],
            },
            
        }
        allowed_crud_actions = permissions.get(model_name,{}).get(user.role.nom,[])


        methods = {
            "GET":"retrieve",
            "POST":"create",
            "PUT":"update",
            "PATCH":"update",
            "DELETE":"destroy",
        }
        crud_action = methods.get(request.method)
        return crud_action in allowed_crud_actions if crud_action else False
