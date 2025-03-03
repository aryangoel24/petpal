from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.reverse import reverse
from rest_framework.pagination import PageNumberPagination

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    class CustomPagination(PageNumberPagination):
        page_size = 5
        page_size_query_param = 'page_size'
        max_page_size = 100

    pagination_class = CustomPagination

    def get_queryset(self):
        # Filter notifications for the authenticated user
        queryset = Notification.objects.filter(user=self.request.user)

        # Sorting by creation time
        queryset = queryset.order_by('-created_at')

        # Filter by read/unread status
        read_status = self.request.query_params.get('read_status')
        if read_status is not None:
            read_status = bool(int(read_status))  # Convert to boolean
            queryset = queryset.filter(read_status=read_status)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data

            # Add links to individual notification views
            for notification in data:
                notification['notification_detail_link'] = reverse('notifications:notification-detail', args=[notification['id']])

            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Add links to individual notification views
        for notification in data:
            notification['notification_detail_link'] = reverse('notifications:notification-detail', args=[notification['id']])

        return Response(data)

class NotificationDetailView(generics.RetrieveDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the notification instance
        instance = self.get_object()

        # Update read_status to True
        instance.read_status = True
        instance.save()

        return super().get(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        instance.delete()
