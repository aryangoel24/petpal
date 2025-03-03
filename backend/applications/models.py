from django.db import models
from accounts.models import Seeker, Shelter
from listings.models import PetListing
from django.utils import timezone

# Create your models here.
class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('withdrawn', 'Withdrawn'),
    ]

    seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    pet = models.ForeignKey(PetListing, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    creation_time = models.DateTimeField(default=timezone.now)
    last_update_time = models.DateTimeField(default=timezone.now)
    description = models.TextField(default='')