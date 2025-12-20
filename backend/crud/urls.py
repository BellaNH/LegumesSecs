from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView, TokenBlacklistView)
from django.contrib import admin
from django.urls import path, include 
from api.views import *
urlpatterns = [
    path('api/', include('api.urls',namespace='api')),
    path('', include('rest_framework.urls',namespace='rest_framework')),
    path('api/me/', CurrentUserView.as_view(), name='current-user'),
    path('api/token/',TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/',TokenBlacklistView.as_view(), name='token_blacklist'),
]
