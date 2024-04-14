from . import models
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.User
        fields = ['email_id', 'username', 'password','first_name', 'last_name', 'dob']
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}}
        }
    
    def create(self, validated_data):
        # Use the create_user method of the model manager
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user