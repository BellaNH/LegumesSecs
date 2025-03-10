from .models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import * 
from safedelete.admin import SafeDeleteAdmin
from django.apps import apps

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Override default fields to match your CustomUser model
    list_display = ("email", "nom", "prenom","subdivision" , "role","is_active", "is_staff", "is_superuser")
    ordering = ("email",)  # Use email instead of username

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (("Personal info"), {"fields": ("nom", "prenom", "phoneNum","subdivision")}),
        (("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "role")}),
        (("Important dates"), {"fields": ("createDate",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "nom", "prenom", "phoneNum", "role","subdivision", "password1", "password2"),
        }),
    )

    search_fields = ("email", "nom", "prenom")
    def save_model(self, request, obj, form, change):
        if "password" in form.cleaned_data:
            row_password=form.cleaned_data["password"]
            if not row_password.startswith("pbkdf2_sha256$"):
                obj.set_password(row_password)
        obj.save()
def restore_data(self,request,queryset):
    queryset.undelete()
class SafeDelete(SafeDeleteAdmin):
    list_display=('id','deleted')
    list_filter=('deleted')
    actions= [restore_data]
    admin.site.register(CustomUser, CustomUserAdmin)
    admin.site.register(Espece)
    admin.site.register(Agriculteur)
    admin.site.register(Wilaya)
    admin.site.register(Objectif)
    admin.site.register(SubDivision)
    admin.site.register(Commune)
    admin.site.register(Exploitation)
    admin.site.register(Parcelle)
    admin.site.register(Role)
