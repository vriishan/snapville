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
from django.shortcuts import get_object_or_404
from utils.hash_utils import *


class ImageViewSet(viewsets.GenericViewSet,
                       ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        # Get query params
        tag = self.request.query_params.get('tag', None)

        # to be implemented
        userId = self.request.query_params.get('userId', None)

        # Filter by category if it's in query params
        if tag is not None:
            tag = get_object_or_404(Tag, name=tag)
            imageList = ImageTag.objects.using('default').filter(tag=tag.id).values_list('image_id', flat=True)
            return self.getImagesFromIdList(imageList)

        allImages = []
        for part in DB_LOOKUP.values():
            if part == 'default':
                continue
            allImages.extend(Image.objects.using(part).all())
        
        return allImages


    def destroy(self, request, *args, **kwargs):
        
        id = self.kwargs.get('pk')

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
    
