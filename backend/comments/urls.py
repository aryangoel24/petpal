from django.urls import path
from .views import CommentListCreateAPIView

app_name = "comments"
urlpatterns = [
    path('', CommentListCreateAPIView.as_view(), name='comment_list_create'),
]
