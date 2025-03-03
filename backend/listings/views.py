from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PetListingSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import PetListing
from accounts.models import Shelter, User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from notifications.models import Notification

class PetListingView(ListCreateAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['shelter__name', 'status', 'breed', 'age', 'size', 'gender']
    ordering_fields = ['name', 'age', 'size']
    ordering = 'name'  # Default ordering

    def perform_create(self, serializer):
        # Set the shelter attribute to the current authenticated user
        shelter = Shelter.objects.get(user=self.request.user)
        pet_listing = serializer.save(shelter=shelter)

        # Notify all seekers
        seekers = User.objects.filter(is_shelter=False)
        for seeker in seekers:
            Notification.objects.create(
                user=seeker,
                content=f"A new pet listing '{pet_listing.name}' is available for adoption!",
                associated_model_type="listing",
                associated_model_id=pet_listing.id
            )

    def create(self, request, *args, **kwargs):
        if not request.user.is_shelter:
            return Response({"error": "Only shelters are allowed to create pet listings."}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtering by multiple parameters
        shelter_name = self.request.query_params.get('shelter__name')
        status_filter = self.request.query_params.get('status')
        breed = self.request.query_params.get('breed')
        age = self.request.query_params.get('age')
        size = self.request.query_params.get('size')
        gender = self.request.query_params.get('gender')
        sort_by = self.request.query_params.get('ordering')
        if sort_by in self.ordering_fields:
            queryset = queryset.order_by(sort_by)
            
        if shelter_name:
            try:
                filter_shelter = Shelter.objects.get(name=shelter_name)
                queryset = queryset.filter(shelter=filter_shelter)
            except Shelter.DoesNotExist:
                raise NotFound(detail=f"Shelter with name '{shelter_name}' does not exist.")

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            queryset = queryset.filter(status='available')
        if breed:
            queryset = queryset.filter(breed=breed)
        if age:
            queryset = queryset.filter(age=age)
        if size:
            queryset = queryset.filter(size=size)
        if gender:
            queryset = queryset.filter(gender=gender)

        return queryset

    class CustomPagination(PageNumberPagination):
        page_size = 4
        page_size_query_param = 'page_size'
        max_page_size = 100

    pagination_class = CustomPagination

    
class PetListingDetailUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # No authentication required for GET
        return super().get_permissions()

    def get_object(self):
        obj = super().get_object()
        print(obj)
        if obj.shelter.user != self.request.user and self.request.method != 'GET':
            raise PermissionDenied("You don't have permission to update or delete this pet listing.")
        return obj

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Fetch all shelter data related to the PetListing
        shelter_data = instance.shelter.__dict__  # Fetch all shelter data
        shelter_data.pop('_state')  # Remove Django state information if it's present

        # Include shelter data into the serialized data
        serialized_data = serializer.data
        serialized_data['shelter'] = shelter_data

        return Response(serialized_data)

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Pet Listing deleted successfully"}, status=status.HTTP_204_NO_CONTENT)