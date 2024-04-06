from .models import *
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView

class TagViewSet(viewsets.GenericViewSet,
                       ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    '''
    Contains information about a command-line Unix program.
    '''
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Tag.objects.all()