from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

app_name = "accounts"
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('seeker/', views.SeekerCreateView.as_view(), name='seeker-register'),
    path('shelter/', views.ShelterCreateView.as_view(), name='shelter-register'),
    path('profile/<int:user_id>/', views.ProfileView.as_view(), name='profile'),
    path('profile/', views.ProfileChangeView.as_view(), name='profile-change'),
    path('all_shelters/', views.ShelterListView.as_view(), name='shelter-list'),
    path('current-user/', views.CurrentUserView.as_view(), name='current-user'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('blogposts/', views.BlogPostListCreateView.as_view(), name='blogpost'),
    path('blogposts/<int:blog_id>/', views.BlogPostDetailView.as_view(), name='blogpost-detail'),
]