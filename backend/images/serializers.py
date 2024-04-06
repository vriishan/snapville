from . import models
from rest_framework import serializers
from images.models import ImageMetadata, Image
from tags.serializers import TagSerializer
from tags.models import Tag
from image_tags.models import ImageTag

class ImageMetadataSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageMetadata
        fields = ['size', 'resolution', 'timestamp', 'file_type', 'file_name']


class ImageSerializer(serializers.ModelSerializer):
    metadata = ImageMetadataSerializer()
    tags = serializers.ListField(
        child=serializers.CharField(), 
        required=True, 
        write_only=True,  # Accept tags on write but they are not a model field
    )

    class Meta:
        model = models.Image
        fields = ['id', 'title', 'path', 'thumbnail_path', 'tags', 'metadata']

    def get_tags(self, instance):
        # Custom logic to retrieve tags for the image
        # This could involve querying the separate database for tags associated with this image
        tags_for_image = Tag.objects.filter(image_tags__image_id=instance.id)
        return [tag.name for tag in tags_for_image]

    
    def create(self, validated_data):
        metadata_data = validated_data.pop('metadata')
        tags_data = validated_data.pop('tags', [])
        metadata = ImageMetadata.objects.create(**metadata_data)
        validated_data['id'] = metadata.id
        for tag in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag)
            ImageTag.objects.get_or_create(image_id=metadata.id, tag=tag)
        image = Image.objects.create(metadata=metadata, **validated_data)
        return image

    def update(self, image_instance, validated_data):
         # Update fields of the Image model
        image_instance.title = validated_data.get('title', image_instance.title)
        image_instance.path = validated_data.get('path', image_instance.path)
        image_instance.thumbnail_path = validated_data.get('thumbnail_path', image_instance.thumbnail_path)

        # Assuming validated_data contains a 'metadata' key with a dict of the metadata updates
        metadata_data = validated_data.get('metadata', {})

        tags_data = validated_data.pop('tags', [])
        
        ImageTag.objects.filter(image_id=image_instance.id).delete()
        # need more elegant way of doing this 
        for tag in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag)
            ImageTag.objects.get_or_create(image_id=image_instance.id, tag=tag)

        # Update fields of the related ImageMetadata model
        # Note: image_instance.metadata directly accesses the related ImageMetadata instance
        if metadata_data:
            for field in ['size', 'resolution', 'timestamp', 'file_type', 'file_name']:
                setattr(image_instance.metadata, field, metadata_data.get(field, getattr(image_instance.metadata, field)))
            image_instance.metadata.save()

        # Save the updated Image instance
        image_instance.save()

        # Return the updated Image instance
        return ImageSerializer(image_instance).data

    def to_representation(self, instance):
        """
        Add tags to the serialized output.
        """
        ret = super().to_representation(instance)
        ret['tags'] = self.get_tags(instance)  # Populate tags for read operations
        return ret