from . import models
from rest_framework import serializers
from images.models import ImageMetadata, Image
from tags.models import Tag
from image_tags.models import ImageTag
from utils.hash_utils import hash_to_partition
from users.models import User
from users.serializers import UserSerializer
from user_images.models import UserImage
import uuid


class ImageMetadataSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageMetadata
        fields = ['size', 'resolution', 'uploaded_on', 'file_type', 'file_name']


class ImageSerializer(serializers.ModelSerializer):
    metadata = ImageMetadataSerializer(required=False)
    tags = serializers.ListField(
        child=serializers.CharField(), 
        required=True, 
        write_only=True,  # Accept tags on write but they are not a model field
    )

    class Meta:
        model = models.Image
        fields = ['id', 'title', 'path', 'thumbnail_path', 'tags', 'metadata', 'owner', 'viewcount']
        read_only_fields = ('viewcount',)

        extra_kwargs = {
            'title': {'required': True},
            'tags': {'required': True},
            'owner': {'required': True},
            'path': {'required': False},
            'thumbnail_path': {'required': False},
            'viewcount': {'required': False}
        }

    def get_tags(self, instance):
        # Custom logic to retrieve tags for the image
        # This could involve querying the separate database for tags associated with this image
        tags_for_image = Tag.objects.using('default').filter(image_tags__image_id=instance.id)
        return [tag.name for tag in tags_for_image]
    
    def save(self, **kwargs):
        # Pass all kwargs to the super().save() method
        return super().save(**kwargs)
    
    def create(self, validated_data):
        metadata_data = validated_data.pop('metadata')
        tags_data = validated_data.pop('tags', [])

        id = validated_data.pop('custom_id')
        db = hash_to_partition(id)

        metadata_data['id'] = id
        validated_data['id'] = id

        user = User.objects.using('default').get(email_id=validated_data['owner'])

        metadata = ImageMetadata.objects.using(db).create(**metadata_data)

        for tag in tags_data:
            tag, created = Tag.objects.using('default').get_or_create(name=tag)
            ImageTag.objects.using('default').get_or_create(image_id=metadata.id, tag=tag)
        
        UserImage.objects.using('default').create(image_id=id, user_id=user)

        image = Image.objects.using(db).create(metadata=metadata, **validated_data)
        image.id = id
        return image

    def update(self, image_instance, validated_data):
        
        db = hash_to_partition(image_instance.id)

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
            tag, created = Tag.objects.using('default').get_or_create(name=tag)
            ImageTag.objects.using('default').get_or_create(image_id=image_instance.id, tag=tag)

        # Update fields of the related ImageMetadata model
        # Note: image_instance.metadata directly accesses the related ImageMetadata instance
        if metadata_data:
            for field in ['size', 'resolution', 'uploaded_on', 'file_type', 'file_name']:
                setattr(image_instance.metadata, field, metadata_data.get(field, getattr(image_instance.metadata, field)))
            image_instance.metadata.save(using=db)

        # Save the updated Image instance
        image_instance.save(using=db)

        # Return the updated Image instance
        return ImageSerializer(image_instance).data

    def to_representation(self, instance):
        """
        Add tags to the serialized output.
        """

        ret = super().to_representation(instance)
        if self.context.get('output', False):
            ret['tags'] = self.get_tags(instance)  # Populate tags for read operations
            ret['user'] = UserSerializer(User.objects.using('default').get(email_id=instance.owner)).data
        return ret