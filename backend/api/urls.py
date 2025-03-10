from django.urls import path
from .views import *

app_name ='api'

urlpatterns = [
    path('parcelle/<int:pk>/', ParcelleDetail.as_view(),name="ParcelleDetailCreate" ),
    path('parcelle/',ParcelleList.as_view(),name="ParcelleListCreate"),
    path('exploitation/<int:pk>/', ExploitationDetail.as_view(),name="exploitationDetailCreate" ),
    path('exploitation/',ExploitationList.as_view(),name="exploitationListCreate"),
    path('commune/<int:pk>/', CommuneDetail.as_view(),name="communeDetailCreate" ),
    path('commune/',CommuneList.as_view(),name="communeListCreate"),
    path('subdivision/<int:pk>/', SubDivisionDetail.as_view(),name="subdivisionDetailCreate" ),
    path('subdivision/',SubDivisionList.as_view(),name="subdivisionListCreate"),
    path('wilaya/<int:pk>/', WilayaDetail.as_view(),name="wilayaDetailCreate" ),
    path('wilaya/',WilayaList.as_view(),name="wilayaListCreate"),
    path('espece/<int:pk>/', EspeceDetail.as_view(),name="especeDetailCreate" ),
    path('espece/',EspeceList.as_view(),name="especeListCreate"),
    path('agriculteur/<int:pk>/', AgriculteurDetail.as_view(),name="agriculteurDetailCreate" ),
    path('agriculteur/',AgriculteurList.as_view(),name="agriculteurListCreate"),
    path('objectif/<int:pk>/', ObjectifDetail.as_view(),name="objectifDetailCreate" ),
    path('objectif/',ObjectifList.as_view(),name="objectifListCreate"),
    path('role/<int:pk>/', RoleDetail.as_view(),name="roleDetailCreate" ),
    path('role/',RoleList.as_view(),name="roleListCreate"),
    path('users/<int:pk>/', CustomUserDetail.as_view(),name="roleDetailCreate" ),
    path('users/',CustomUserList.as_view(),name="roleListCreate"),
 
  
]