from rest_framework import serializers
from .models import User, Shelter, Seeker, BlogPost

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_pet_seeker', 'is_shelter']

class ShelterSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Shelter
        fields = ['user', 'name', 'location', 'mission_statement']

class SeekerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Seeker
        fields = ['user', 'name', 'location', 'profile_picture']

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'shelter', 'title', 'content', 'publication_date', 'creator']
        read_only_fields = ['id', 'shelter', 'publication_date', 'creator']