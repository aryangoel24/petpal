from rest_framework import serializers
from .models import PetListing

class PetListingSerializer(serializers.ModelSerializer):
    photos = serializers.ImageField(required=False) 
    class Meta:
        model = PetListing
        exclude = ('shelter',) 

    def validate_age(self, value):
        if value <= 0:
            raise serializers.ValidationError("Age must be a positive number.")
        return value

    def validate_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value

    def create(self, validated_data):
        validated_data['status'] = PetListing.AVAILABLE  # Set default status
        return super().create(validated_data)