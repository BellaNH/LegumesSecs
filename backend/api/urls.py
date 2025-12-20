from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
app_name ='api'

router = DefaultRouter()
router.register('user', UserList, basename='user')
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
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('filterCommuneBySubdiv/',CommunesBySubdivisionView.as_view(),name='CBS'),
    path('filterSubdivBywilaya/',SubDivisionsByWilayaView.as_view(),name='SBW'),
    path('filterCommuneBywilaya/',communeByWilayaView.as_view(),name='CBW'),
    path('exploitations-filter/',ExploitationFilteredList.as_view(),name='explifilter'),
    path('agriculteur-filter/',AgriculteurFilteredList.as_view(),name='agrifilter'),
    path("active_this_year/", ActiveAgriculteurThisYearView.as_view(), name="agriactive"),
    path("superficie_espece_comparaision/", SuperficieComparaisionByEspece.as_view(), name="superficie_espece"),
    path("yearly_production/", YearlyProductionView.as_view(), name="superficie_espece"),
    path("top_wilayas/", TopWilayasByEspeceView.as_view(), name="superficie_espece"),
    path("sup_lab_sin_prod/", SupLaboureeSinistreeProductionByEspeceView.as_view(), name="sup_lab_sin_prod"),
    path("prev_vs_prod/", PrevProductionVsProductionView.as_view(), name="prev_prod")    
    ]