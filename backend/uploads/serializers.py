from rest_framework.serializers import Serializer, FileField
from images.serializers import ImageSerializer

# Serializers define the API representation.
class UploadSerializer(Serializer):
    image = FileField()
    data = ImageSerializer()
    
    class Meta:
        fields = ['image']