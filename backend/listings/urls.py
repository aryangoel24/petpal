from . import views
from django.urls import path

app_name = "listings"
urlpatterns = [
    path('<int:pk>/', views.PetListingDetailUpdateDeleteView.as_view(), name='pet-listing-modify'),
    path('', views.PetListingView.as_view(), name='pet_listing_list'),
]