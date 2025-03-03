from rest_framework import serializers
from .models import Comment
from applications.models import Application

# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'user', 'text', 'created_at', 'shelter', 'application']

#     def validate(self, data):
#         user = self.context['request'].user
#         application_id = data.get('application')
#         shelter_id = data.get('shelter')

#         # Validate that the user is the specific shelter or pet seeker commenting on their application
#         if application_id:
#             application = Application.objects.get(pk=application_id)
#             if user != application.seeker.user and user != application.shelter.user:
#                 raise serializers.ValidationError("You don't have permission to comment on this application.")

#         return data

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'shelter', 'application', 'user_name']
        read_only_fields = ['user', 'user_name']  # Make the user field read-only

    def validate(self, data):
        user = self.context['request'].user
        application_id = data.get('application')

        # Validate that the user is the specific shelter or pet seeker commenting on their application
        if application_id:
            if user != application_id.seeker.user and user != application_id.shelter.user:
                raise serializers.ValidationError("You don't have permission to comment on this application.")

        return data
