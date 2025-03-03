from django.db import models
from accounts.models import User, Shelter
from django.urls import reverse
from listings.models import PetListing
from applications.models import Application

# Create your models here.

class Comment(models.Model):
    # Fields utilized 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, null=True, blank=True)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, null=True, blank=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, null=True, blank=True)
    user_name = models.CharField(max_length=255)
