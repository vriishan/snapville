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

    def update(self, image_instance, validated_data):
         # Update fields of the Image model
        image_instance.title = validated_data.get('title', image_instance.title)
        image_instance.path = validated_data.get('path', image_instance.path)
        image_instance.thumbnail_path = validated_data.get('thumbnail_path', image_instance.thumbnail_path)
        image_instance.tags = validated_data.get('tags', image_instance.tags)

        # Assuming validated_data contains a 'metadata' key with a dict of the metadata updates
        metadata_data = validated_data.get('metadata', {})

        # Update fields of the related ImageMetadata model
        # Note: image_instance.metadata directly accesses the related ImageMetadata instance
        if metadata_data:
            metadata_instance = image_instance.metadata
            metadata_instance.size = metadata_data.get('size', metadata_instance.size)
            metadata_instance.resolution = metadata_data.get('resolution', metadata_instance.resolution)
            metadata_instance.timestamp = metadata_data.get('timestamp', metadata_instance.timestamp)
            metadata_instance.file_type = metadata_data.get('file_type', metadata_instance.file_type)
            metadata_instance.file_name = metadata_data.get('file_name', metadata_instance.file_name)
            metadata_instance.save()

        # Save the updated Image instance
        image_instance.save()

        # Return the updated Image instance
        return image_instance