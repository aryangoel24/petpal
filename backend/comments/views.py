from rest_framework import generics, permissions, exceptions
from .models import Comment
from .serializers import CommentSerializer
from applications.models import Application
from accounts.models import Shelter, Seeker
from django.utils import timezone
from notifications.models import Notification
from rest_framework.pagination import PageNumberPagination

class CommentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    class CustomPagination(PageNumberPagination):
        page_size = 4
        page_size_query_param = 'page_size'
        max_page_size = 100

    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        application_id = self.request.query_params.get('application')
        shelter_id = self.request.query_params.get('shelter')

        # Check if the user is the specific shelter or pet seeker trying to view comments for their application
        if application_id:
            try:
                application = Application.objects.get(pk=application_id)
                if user == application.seeker.user or user == application.shelter.user:
                    return Comment.objects.filter(application=application).order_by('-created_at')
                else:
                    raise exceptions.PermissionDenied("You don't have permission to view comments for this application.")
            except Application.DoesNotExist:
                return Comment.objects.none()

        # Check if the user is a shelter trying to view comments for their shelter
        elif shelter_id:
            try:
                shelter = Shelter.objects.get(pk=shelter_id)
                return Comment.objects.filter(shelter=shelter).order_by('-created_at')
            except Shelter.DoesNotExist:
                return Comment.objects.none()

        # Return all comments for any other user
        else:
            return Comment.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        application_id = self.request.data.get('application')
        shelter_id = self.request.data.get('shelter')
        if user.is_shelter:
            customUser = Shelter.objects.get(pk=user)
        else:
            customUser = Seeker.objects.get(pk=user)

        # Check if the user is the specific shelter or pet seeker commenting on their application
        if application_id:
            application = Application.objects.get(id=application_id)
            if user == application.seeker.user or user == application.shelter.user:
                serializer.save(user=user, user_name = customUser.name)

                # Determine the user to notify based on the comment creator
                notify_user = application.shelter.user if user == application.seeker.user else application.seeker.user

                # Create a notification for the appropriate user
                Notification.objects.create(
                    user=notify_user,
                    content=f"A new comment has been added to your application for pet '{application.pet.name}'.",
                    associated_model_type="comment",
                    associated_model_id=serializer.instance.id
                )

                application.last_update_time = timezone.now()
                application.save()
            else:
                raise exceptions.PermissionDenied("You don't have permission to comment on this application.")
        elif shelter_id:
            serializer.save(user=user, user_name = customUser.name)
            shelter_obj = Shelter.objects.get(pk=shelter_id)
            # Create a notification for the shelter associated with the comment
            Notification.objects.create(
                user=shelter_obj.user,
                content="A new comment has been added to your shelter profile.",
                associated_model_type="comment",
                associated_model_id=serializer.instance.id
            )

        # Raise an error if neither condition is met
        else:
            raise exceptions.PermissionDenied("Invalid comment creation request.")
