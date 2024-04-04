import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

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
    path = models.URLField(max_length=500)
    thumbnail_path = models.URLField(max_length=500)
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    metadata = models.OneToOneField(ImageMetadata, on_delete=models.CASCADE)
