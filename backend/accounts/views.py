from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from .models import User, Seeker, Shelter, BlogPost
from .serializers import UserSerializer, ShelterSerializer, SeekerSerializer, BlogPostSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from applications.models import Application
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            RefreshToken(refresh_token).blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user

        if user.is_shelter:
            shelter = Shelter.objects.get(user=user)
            serializer = ShelterSerializer(shelter)
            return Response(serializer.data)

        elif user.is_pet_seeker:
            seeker = Seeker.objects.get(user=user)
            serializer = SeekerSerializer(seeker)
            return Response(serializer.data)

        else:
            user_serializer = UserSerializer(user)
            return Response(user_serializer.data)

class SeekerCreateView(CreateAPIView):

    def create(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')
        name = data.get('name')
        location = data.get('location')
        profile_picture = request.FILES.get('profile_picture')

        if not (username and email and password and password2 and name and location):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if password != password2:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        

        user = User.objects.create_user(username=username, email=email, password=password, is_pet_seeker=True)
        profile = Seeker(user=user, name=name, location=location, profile_picture=profile_picture)
        profile.save()

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class ShelterCreateView(CreateAPIView):

    def create(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')
        name = data.get('name')
        location = data.get('location')
        mission_statement = data.get('mission_statement')

        if not (username and email and password and password2 and name and location and mission_statement):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if password != password2:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, is_shelter=True)
        shelter = Shelter(user=user, name=name, location=location, mission_statement=mission_statement)
        shelter.save()

        return Response({'message': 'Shelter created successfully'}, status=status.HTTP_201_CREATED)
    
class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        viewer = self.request.user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_shelter:
            shelter = Shelter.objects.get(user=user)
            serializer = ShelterSerializer(shelter)
            return Response(serializer.data)

        elif user.is_pet_seeker:
            print(viewer)
            if viewer.is_pet_seeker and viewer != user:
                return Response({"error": "You cannot view another seeker"}, status=status.HTTP_403_FORBIDDEN)
            elif viewer.is_shelter:
                viewer_shelter = Shelter.objects.get(user=viewer)
                # Check if the shelter has an active application with the pet seeker
                has_active_application = Application.objects.filter(
                    shelter=viewer_shelter,
                    seeker=user.seeker
                ).exists()
                if not has_active_application:
                    return Response({"error": "No active application with this pet seeker"}, status=status.HTTP_403_FORBIDDEN)

            seeker = Seeker.objects.get(user=user)
            serializer = SeekerSerializer(seeker)
            return Response(serializer.data)

        else:
            user_serializer = UserSerializer(user)
            return Response(user_serializer.data)
    
class ProfileChangeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if user.is_pet_seeker:
            return Seeker.objects.get(user=user)

        elif user.is_shelter:
            return Shelter.objects.get(user=user)

        return None  # Return None or raise a 404 if the user type doesn't match Seeker or Shelter

    def get_serializer_class(self):
        user = self.request.user

        if user.is_pet_seeker:
            return SeekerSerializer

        elif user.is_shelter:
            return ShelterSerializer

        return None  # Return None or handle the case where the user type is not Seeker or Shelter

    def put(self, request):
        instance = self.get_object()

        data = request.data.copy()
        if request.user.is_pet_seeker:
            profile_picture = request.FILES.get('profile_picture')

            if profile_picture:
                data['profile_picture'] = profile_picture

        # Exclude 'user' field from being updated
        data.pop('user', None)

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        user = request.user
        user = User.objects.get(id=user.id)
        user.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class CustomPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 100

    
class ShelterListView(ListAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    serializer_class = ShelterSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Shelter.objects.all()
    
class BlogPostListCreateView(ListCreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.is_pet_seeker:
            raise exceptions.PermissionDenied("You don't have permission to create a blog")
        # Automatically set the shelter as the creator of the blog post
        shelter = Shelter.objects.get(pk=self.request.user.id)
        serializer.save(shelter=shelter, creator=shelter.name)

    def get_queryset(self):
        shelter_id = self.request.query_params.get('shelter')
        if shelter_id:
            return BlogPost.objects.filter(shelter=shelter_id)
        else:
            return BlogPost.objects.all()
        # Only show blog posts created by the requesting shelter
    
class BlogPostDetailView(RetrieveAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.all()

    def get_object(self):
        print("here")
        blog_id = self.kwargs.get('blog_id')
        queryset = self.get_queryset()
        blog = get_object_or_404(queryset, id=blog_id)
        return blog