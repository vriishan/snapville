from django.db import models
from django.db.models import UniqueConstraint
from users.models import User

# Create your models here.
class UserImage(models.Model):
    image_id = models.CharField(max_length=100)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='image_tags')
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['image_id', 'user_id'], name='user_image_constraint')
        ]