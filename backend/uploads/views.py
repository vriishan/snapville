from rest_framework import status
import json, os
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from snapville import settings
from utils import process_image, create_thumbnail
from images.serializers import ImageSerializer
from images.models import Image

class UploadViewSet(ViewSet):
    # Assuming serializer_class and other parts of the class remain the same

    def create(self, request):
        imageFile = request.FILES.get('image')
        imageData = request.data.get('data', None)
        
        if imageFile:
            file_path = os.path.join(settings.IMAGE_DIR, imageFile.name)
            thumbnail_path = os.path.join(settings.THUMBNAIL_DIR, imageFile.name)

            with open(file_path, 'wb+') as destination:
                for chunk in imageFile.chunks():
                    destination.write(chunk)

            process_image(file_path=file_path)
            create_thumbnail(file_path, thumbnail_path)

        if imageData:
            # Process the JSON data for additional image details and update the record
            data = json.loads(imageData)
            # Here, you would update the existing image record with any new details provided
            # This could involve updating fields in a database record, for example
            # Assuming `ImageSerializer` handles validation and saving of data
            imageSerializer = ImageSerializer(data=data)
            if imageSerializer.is_valid():
                imageSerializer.save()
                return Response(imageSerializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(imageSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # handle errors
        return Response({})

    def update(self, request, pk=None):
        try:
            image = Image.objects.get(pk=pk)
        except:
            return Response({"error": "Image record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        imageFile = request.FILES.get('image')
        imageData = request.data.get('data', None)

        if imageFile:
            file_path = os.path.join(settings.IMAGE_DIR, imageFile.name)
            thumbnail_path = os.path.join(settings.THUMBNAIL_DIR, imageFile.name)

            with open(file_path, 'wb+') as destination:
                for chunk in imageFile.chunks():
                    destination.write(chunk)

            process_image(file_path=file_path)
            create_thumbnail(file_path, thumbnail_path)
        
        if imageData:
            # Process the JSON data for additional image details and update the record
            data = json.loads(imageData)
            # Here, you would update the existing image record with any new details provided
            # This could involve updating fields in a database record, for example
            # Assuming `ImageSerializer` handles validation and saving of data
            imageSerializer = ImageSerializer(data=data)
            if imageSerializer.is_valid():
                imageSerializer.update(image, data)
                return Response(imageSerializer.data, status=status.HTTP_200_OK)
            else:
                return Response(imageSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({})