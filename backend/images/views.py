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
from django.shortcuts import get_object_or_404
from utils.hash_utils import *


class ImageViewSet(viewsets.GenericViewSet,
                       ListAPIView, RetrieveAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]

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
        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    def get_queryset(self):
        if self.request.query_params:
            # Get query params
            tag = self.request.query_params.get('tag', None)

            email_id = self.request.query_params.get('email_id', None)

            sortBy = self.request.query_params.get('sortBy', False)

            res = []

            # Filter by category if it's in query params
            if tag is not None:
                tag = get_object_or_404(Tag, name=tag)
                imageList = ImageTag.objects.using('default').filter(tag=tag.id).values_list('image_id', flat=True) 
                res = self.getImagesFromIdList(imageList)
                # this should ideally be done on the frontend
                res.sort(key=lambda x: x.viewcount, reverse=True)

            elif email_id is not None:
                imageList = UserImage.objects.using('default').filter(user_id=email_id).values_list('image_id', flat=True)
                res = self.getImagesFromIdList(imageList)
                # this should ideally be done on the frontend
                print(res)
                res.sort(key=lambda x: x.viewcount, reverse=True)
            
            print(res)
            return res

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
        instance = Image.objects.using(db).get(pk=id)
        
        # Custom pre-delete logic here
        # For example, logging deletion or checking some conditions
        print(f"Deleting image: {instance.id}")

        # remove image from uploads and thumbnails
        if os.path.exists(instance.thumbnail_path):
            os.remove(instance.thumbnail_path)

        if os.path.exists(instance.path):
            os.remove(instance.path)

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
    
