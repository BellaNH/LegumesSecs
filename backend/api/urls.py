from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
app_name ='api'

router = DefaultRouter()
router.register('user',UserList,basename='user')
router.register('userWilaya',UserWilayaList,basename='userWilaya')
router.register('userSubdiv',UserSubdivList,basename='userSubdiv')
router.register('parcelle',ParcelleList,basename='parcelle')
router.register('exploitation',ExploitationList,basename='exploitation')
router.register('exploitation-parcelles',ExploitationWithParcelledList,basename='exploiparcelle')
router.register('commune',CommuneList,basename='commune')
router.register('subdivision',SubDivisionList,basename='subdivision')
router.register('wilaya',WilayaList,basename='wilaya')
router.register('espece',EspeceList,basename='espece')
router.register('agriculteur',AgriculteurList,basename='agriculteur')
router.register('objectif',ObjectifList,basename='objectif')
router.register('role',RoleList,basename='role')



urlpatterns = [
    path('',include(router.urls)),
    path('login/',login_user,name='login'),
    path('filterCommuneBySubdiv/',CommunesBySubdivisionView.as_view(),name='CBS'),
    path('filterSubdivBywilaya/',SubDivisionsByWilayaView.as_view(),name='SBW'),
    path('filterCommuneBywilaya/',communeByWilayaView.as_view(),name='CBW'),
    path('exploitations-filter/',ExploitationFilteredList.as_view(),name='explifilter')
    ]