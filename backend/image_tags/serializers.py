from . import models
from rest_framework import serializers


class ImageTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageTag
        fields = ['image_id', 'tag_id']


