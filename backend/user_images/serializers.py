from . import models
from rest_framework import serializers


class UserImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserImage
        fields = ['image_id', 'user_id']