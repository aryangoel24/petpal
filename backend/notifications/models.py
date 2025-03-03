from django.db import models
from accounts.models import User
from django.urls import reverse

class Notification(models.Model):
    # Fields
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)
    associated_model_type = models.CharField(max_length=50) 
    associated_model_id = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.content}"

    def mark_as_read(self):
        self.read_status = True
        self.save()

    def get_associated_model_url(self):
        # Return the URL for the associated model based on the type and ID
        if self.associated_model_type == "comment":
            return reverse('comments:comment_list_create')
        elif self.associated_model_type == "application":
            return reverse('applications:update', args=[str(self.associated_model_id)])
        elif self.associated_model_type == "listing":
            return reverse('listings:pet-listing-modify', args=[str(self.associated_model_id)])
        # Add more cases for other associated model types as needed
        else:
            return None