from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, mixins
from images.models import Image
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView

class ImageViewSet(viewsets.GenericViewSet,
                       ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Image.objects.all()
    