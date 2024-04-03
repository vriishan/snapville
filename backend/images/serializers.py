from . import models
from rest_framework import routers, serializers, viewsets
from images.models import ImageMetadata, Image


class ImageMetadataSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageMetadata
        fields = ['size', 'resolution', 'timestamp', 'file_type', 'file_name']


class ImageSerializer(serializers.ModelSerializer):
    metadata = ImageMetadataSerializer()

    class Meta:
        model = models.Image
        fields = ['title', 'path', 'thumbnail_path', 'tags', 'metadata']
    
    def create(self, validated_data):
        metadata_data = validated_data.pop('metadata')
        metadata = ImageMetadata.objects.create(**metadata_data)
        image = Image.objects.create(metadata=metadata, **validated_data)
        return image

    def update(self, instance, validated_data):
        place_data = validated_data.pop('place')
        place = instance.place

        instance.serves_hot_dogs = validated_data.get('serves_hot_dogs', instance.serves_hot_dogs)
        instance.serves_pizza = validated_data.get('serves_pizza', instance.serves_pizza)
        instance.save()

        place.name = place_data.get('name', place.name)
        place.address = place_data.get('address', place.address)
        place.save()

        return instance