from django.db import models
from accounts.models import Shelter

class PetListing(models.Model):
    AVAILABLE = 'available'
    ADOPTED = 'adopted'
    PENDING = 'pending'
    WITHDRAWN = 'withdrawn'

    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (ADOPTED, 'Adopted'),
        (PENDING, 'Pending'),
        (WITHDRAWN, 'Withdrawn'),
    ]

    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    photos = models.ImageField(upload_to='pet_photos/', blank=True, null=True)
    name = models.CharField(max_length=255)
    breed = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ]
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=AVAILABLE)
