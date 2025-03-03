from rest_framework import serializers
from django.urls import reverse
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    associated_model_url = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'user', 'content', 'created_at', 'read_status', 'associated_model_type', 'associated_model_id', 'associated_model_url']

    def get_associated_model_url(self, data):
        # Return the URL for the associated model based on the type and ID
        if data.associated_model_type == "comment":
            return reverse('comments:comment_list_create')
        elif data.associated_model_type == "application":
            return reverse('applications:application-detail', args=[str(data.associated_model_id)])
        elif data.associated_model_type == "listing":
            return reverse('listings:pet-listing-modify', args=[str(data.associated_model_id)])
        # Add more cases for other associated model types as needed
        else:
            return None
