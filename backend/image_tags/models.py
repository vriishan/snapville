from django.db import models
from tags.models import Tag
from django.db.models import UniqueConstraint

# Create your models here.
class ImageTag(models.Model):
    image_id = models.CharField(max_length=100)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='image_tags')

    class Meta:
        constraints = [
            UniqueConstraint(fields=['image_id', 'tag_id'], name='image_tag_constraint')
        ]