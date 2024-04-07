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

class ImageViewSet(viewsets.GenericViewSet,
                       ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Image.objects.all()
    
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
