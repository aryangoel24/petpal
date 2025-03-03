from . import views
from django.urls import path
app_name = "notifications"
urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
]