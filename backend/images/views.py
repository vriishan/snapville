from collections import defaultdict
from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from images.models import Image
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import status
from rest_framework.response import Response
import os
from image_tags.models import ImageTag
from images.models import ImageMetadata
from tags.models import Tag
from image_tags.models import ImageTag
from user_images.models import UserImage
from utils.hash_utils import *
from snapville.settings import MEDIA_ROOT
from snapville.permissions import IsOwnerOrSuperuser

class ImageViewSet(viewsets.GenericViewSet,
                       ListAPIView, RetrieveAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = ImageSerializer

    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method in ["POST", "UPDATE", "DELETE"]:
            return [IsOwnerOrSuperuser()]

        return [AllowAny()]  # All other methods (GET) is public access

    def retrieve(self, request, *args, **kwargs):
        image_id = kwargs.get('id', None)
        if image_id is None:
            return Response({'error': 'Image ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Fetch the Image instance by UUID
            db = hash_to_partition(image_id)
            instance = Image.objects.using(db).get(id=image_id)
        except Image.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.increment_viewcount()

        # Serialize the Image instance, including related metadata
        serializer = self.get_serializer(instance, context = {'output': True})

        return Response(serializer.data)

    def get_queryset(self):
        if self.request.query_params:
            query_params = self.request.query_params
            image_ids_set = set()

            # Filter by tag if it's in query params
            tag = query_params.get('tag')
            if tag is not None:
                tag_obj = Tag.objects.filter(name=tag).first()
                if tag_obj:
                    query = ImageTag.objects.filter(tag=tag_obj).values_list('image_id', flat=True).query
                    print(str(query))
                    tag_image_ids = ImageTag.objects.filter(tag=tag_obj).values_list('image_id', flat=True)
                    image_ids_set.update(tag_image_ids)

            # Filter by user ID if it's in query params
            username = query_params.get('username')
            if username is not None:
                user_ids = User.objects.filter(username=username).values_list('email_id', flat=True)
                if user_ids:
                    user_image_ids = UserImage.objects.filter(user_id__in=user_ids).values_list('image_id', flat=True)
                    image_ids_set.update(user_image_ids)

            # Filter by title if it's in query params
            title = query_params.get('title')
            if title is not None:
                for part in DB_LOOKUP.values():
                    if part == 'default':
                        continue
                    image_ids_set.update(Image.objects.using(part).filter(title__icontains=title).values_list('id', flat=True))

            # Retrieve the list of images from the combined set of IDs
            if image_ids_set:
                images = self.getImagesFromIdList(list(image_ids_set))
                # Sorting by viewcount should be done on the frontend, but it's included here for completeness
                images = sorted(images, key=lambda x: x.viewcount, reverse=True)
                return images

            return []

        allImages = []
        for part in DB_LOOKUP.values():
            if part == 'default':
                continue
            allImages.extend(Image.objects.using(part).all())
        

        allImages.sort(key=lambda x: x.viewcount, reverse=True)
        return allImages


    def destroy(self, request, *args, **kwargs):
        
        id = self.kwargs.get('id')

        db = hash_to_partition(id)

        # Fetch the object from the specific database
        try:
            instance = Image.objects.using(db).get(pk=id)
        except:
            return Response({"error": "Image record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, instance)

        # Custom pre-delete logic here
        # For example, logging deletion or checking some conditions
        print(f"Deleting image: {instance.id}")

        # remove image from uploads and thumbnails

        thumbnail_path = f'{MEDIA_ROOT}{instance.thumbnail_path}'.replace('\\', '/')
        image_path = f'{MEDIA_ROOT}{instance.path}'.replace('\\', '/')

        if os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)

        if os.path.exists(image_path):
            os.remove(image_path)

        # remove ImageTag entry
        ImageTag.objects.using('default').filter(image_id=instance.id).delete()

        # figure out a better way to handle this delete
        ImageMetadata.objects.using(db).filter(id=instance.id).delete()

        UserImage.objects.using('default').filter(image_id=instance.id).delete()

        # Perform the deletion of the image (this should delete the metadata instance, but that is not happening)
        instance.delete(using=db)

        # Return a custom response or the standard response
        return Response({'message': 'Image deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
            
    def getImagesFromIdList(self, imageList):
        partitionImages = defaultdict(list)

        for imageId in imageList:
            partitionImages[hash_to_partition(imageId)].append(imageId)
        res = []
        for part, imageIds in partitionImages.items():
            res.extend(Image.objects.using(part).filter(id__in=imageIds))

        return res
    
