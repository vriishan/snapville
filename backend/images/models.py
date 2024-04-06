import uuid
from django.db import models
from snapville.settings import MEDIA_ROOT

class ImageMetadata(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    size = models.CharField(max_length=100)
    resolution = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    file_type = models.CharField(max_length=50)
    file_name = models.CharField(max_length=255)

class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    path = models.TextField()
    thumbnail_path = models.TextField()
    metadata = models.OneToOneField(ImageMetadata, on_delete=models.CASCADE)
