from .models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import * 
from safedelete.admin import SafeDeleteAdmin
from django.apps import apps


admin.site.register(CustomUser)
admin.site.register(Espece)
admin.site.register(Agriculteur)
admin.site.register(Wilaya)
admin.site.register(Objectif)
admin.site.register(SubDivision)
admin.site.register(Commune)
admin.site.register(Exploitation)
admin.site.register(Parcelle)
admin.site.register(Role)
admin.site.register(Permissions)
admin.site.register(UserWilaya)
admin.site.register(UserSubdivision)

