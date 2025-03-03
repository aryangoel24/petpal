from rest_framework import serializers, status
from .models import Application
from listings.models import PetListing

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'