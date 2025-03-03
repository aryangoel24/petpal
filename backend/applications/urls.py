from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = "applications"
urlpatterns = [
    path('', views.ApplicationViewSet.as_view({'get': 'list', 'post': 'create'}), name='application-list'),
    path('<int:pk>/', views.ApplicationViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='application-detail'),
]
