from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from listings.models import PetListing
from .serializers import ApplicationSerializer
from rest_framework import status, generics, serializers
from accounts.models import Seeker, Shelter
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView
from django.utils import timezone
from .models import Application
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions
from rest_framework import viewsets
from notifications.models import Notification

# Create your views here.
class CreateApplicationAPIView(CreateAPIView):
    serializer_class = ApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user

        # Check if the user is a Seeker or Shelter
        try:
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            return Response({'error': 'Only seekers are allowed to create applications.'}, status=status.HTTP_403_FORBIDDEN)
        # Get the pet_id from the request data
        pet_id = request.data.get('pet')
        description = request.data.get('description')

        # Check if the pet listing is available
        try:
            pet_listing = PetListing.objects.get(id=pet_id, status='available')
        except PetListing.DoesNotExist:
            return Response({'error': 'Pet listing not available or does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        application_data = {
            'seeker': seeker.user.id,
            'shelter': pet_listing.shelter.user.id,
            'pet': pet_id,
            'description': description,
        }

        serializer = self.get_serializer(data=application_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

class UpdateApplicationStatusAPIView(UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Retrieve the application instance
        instance = self.get_object()

        # Check if the user making the request is the shelter or the seeker
        user = request.user
        is_shelter = user == instance.shelter.user
        is_seeker = user == instance.seeker.user

        # Validate and update the application status based on user role
        if is_shelter and instance.status == 'pending':
            # Shelter can update status from pending to accepted or denied
            allowed_statuses = ['accepted', 'denied']
        elif is_seeker and instance.status in ['pending', 'accepted']:
            # Seeker can update status from pending or accepted to withdrawn
            allowed_statuses = ['withdrawn']
        else:
            return Response({'error': 'You are not allowed to update the status of this application.'}, status=status.HTTP_403_FORBIDDEN)

        # Validate the requested status
        requested_status = request.data.get('status', '').lower()
        if requested_status not in allowed_statuses:
            return Response({'error': f'Invalid status. Allowed statuses: {", ".join(allowed_statuses)}.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status
        instance.status = requested_status
        instance.save()

        # Return the updated data
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class ShelterOrSeekerOwnApplicationsPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.shelter.user or user == obj.seeker.user
    

class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, ShelterOrSeekerOwnApplicationsPermission]

    class CustomPagination(PageNumberPagination):
        page_size = 2
        page_size_query_param = 'page_size'
        max_page_size = 100

    pagination_class = CustomPagination
    
    def get_queryset(self):
        user = self.request.user
        # Filter applications by status

        # Ensure that only the applications of the current shelter or seeker are retrieved
        if hasattr(user, 'shelter'):
            queryset = Application.objects.filter(shelter__user=user)
        elif hasattr(user, 'seeker'):
            queryset = Application.objects.filter(seeker__user=user)
        else:
            queryset = Application.objects.none()

        status_filter = self.request.query_params.get('status', None)

        if status_filter:
            queryset = queryset.filter(status=status_filter.lower())

        # Sort applications by creation time or last update time
        sort_by = self.request.query_params.get('sort_by', None)

        if sort_by == 'creation_time':
            queryset = queryset.order_by('creation_time')
        elif sort_by == 'last_update_time':
            queryset = queryset.order_by('last_update_time')

        return queryset

    def perform_update(self, serializer):
        # Update last update time when an application receives a new comment
        serializer.save(last_update_time=timezone.now())


class ApplicationRetrieveView(generics.RetrieveAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, ShelterOrSeekerOwnApplicationsPermission]
    


class CustomPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 100

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated, ShelterOrSeekerOwnApplicationsPermission]
    pagination_class = CustomPagination

    # def get_queryset(self):
    #     user = self.request.user
        
    #     if hasattr(user, 'shelter'):
    #         return Application.objects.filter(shelter__user=user)
    #     elif hasattr(user, 'seeker'):
    #         return Application.objects.filter(seeker__user=user)
    #     return Application.objects.none()

    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'shelter'):
            queryset = Application.objects.filter(shelter__user=user)
        elif hasattr(user, 'seeker'):
            queryset = Application.objects.filter(seeker__user=user)
        else:
            queryset = Application.objects.none()

        # Filter applications by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter.lower())

        # Sort applications by creation time or last update time
        sort_by = self.request.query_params.get('sort_by', None)
        if sort_by == 'creation_time':
            queryset = queryset.order_by('creation_time')
        elif sort_by == 'last_update_time':
            queryset = queryset.order_by('last_update_time')

        return queryset

    def perform_update(self, serializer):
        # Update last update time when an application receives a new comment
        serializer.save(last_update_time=timezone.now())

    def create(self, request, *args, **kwargs):
        user = self.request.user

        # Check if the user is a Seeker or Shelter
        try:
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            return Response({'error': 'Only seekers are allowed to create applications.'}, status=status.HTTP_403_FORBIDDEN)

        # Get the pet_id from the request data
        pet_id = request.data.get('pet')
        description = request.data.get('description')

        # Check if the pet listing is available
        try:
            pet_listing = PetListing.objects.get(id=pet_id, status='available')
        except PetListing.DoesNotExist:
            return Response({'error': 'Pet listing not available or does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        application_data = {
            'seeker': seeker.user.id,
            'shelter': pet_listing.shelter.user.id,
            'pet': pet_id,
            'description': description,
        }

        serializer = self.get_serializer(data=application_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Create a notification for the shelter
        Notification.objects.create(
            user=pet_listing.shelter.user,
            content=f"New application received for your pet listing '{pet_listing.name}'.",
            associated_model_type="application",
            associated_model_id=serializer.instance.id
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if the user making the request is the shelter or the seeker
        user = request.user
        is_shelter = user == instance.shelter.user
        is_seeker = user == instance.seeker.user

        # Validate and update the application status based on user role
        if is_shelter and instance.status == 'pending':
            # Shelter can update status from pending to accepted or denied
            allowed_statuses = ['accepted', 'denied']
        elif is_seeker and instance.status in ['pending', 'accepted']:
            # Seeker can update status from pending or accepted to withdrawn
            allowed_statuses = ['withdrawn']
        else:
            return Response({'error': 'You are not allowed to update the status of this application.'}, status=status.HTTP_403_FORBIDDEN)

        # Validate the requested status
        requested_status = request.data.get('status', '').lower()
        if requested_status not in allowed_statuses:
            return Response({'error': f'Invalid status. Allowed statuses: {", ".join(allowed_statuses)}.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status
        instance.status = requested_status
        instance.save()

        # Return the updated data
        serializer = self.get_serializer(instance)

        # Create a notification for the seeker
        Notification.objects.create(
            user=instance.seeker.user,
            content=f"Your application for pet listing '{instance.pet.name}' has been updated.",
            associated_model_type="application",
            associated_model_id=serializer.instance.id
        )
        
        return Response(serializer.data)
    
