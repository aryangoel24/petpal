from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_pet_seeker = models.BooleanField(default=False)
    is_shelter = models.BooleanField(default=False)

class Shelter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    mission_statement = models.TextField()


class Seeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

class BlogPost(models.Model):
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='blog_posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    publication_date = models.DateTimeField(auto_now_add=True)
    creator = models.CharField(max_length=200)