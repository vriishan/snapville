from rest_framework import status
import json, os
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from snapville import settings
from utils.image_utils import process_image, create_thumbnail
from images.serializers import ImageSerializer
from images.models import Image
from users.models import User
from utils.hash_utils import hash_to_partition
import uuid
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from snapville.permissions import IsOwnerOrSuperuser

class UploadViewSet(ViewSet):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method in ["POST", "PUT"]:
            return [IsOwnerOrSuperuser()]

        return [IsAuthenticated()] 

    def create(self, request):
        imageFile = request.FILES.get('image')
        imageData = request.data.get('data', None)

        if imageData and imageFile:
            # Process the JSON data for additional image details and update the record
            data = json.loads(imageData)
            # Here, you would update the existing image record with any new details provided
            # This could involve updating fields in a database record, for example
            # Assuming `ImageSerializer` handles validation and saving of data
            imageSerializer = ImageSerializer(data=data, context = {'output': False})
            if imageSerializer.is_valid():
                
                email_id = imageSerializer.data['owner']

                try:
                    user = User.objects.using('default').get(email_id = email_id)
                except:
                    return Response({"error": "Owner with email id not found"}, status=status.HTTP_400_BAD_REQUEST)
                
                self.check_object_permissions(request, user)

                # this id can be generated a different way
                id = uuid.uuid4()
                _, extension = os.path.splitext(imageFile.name)

                file_path = os.path.join(settings.IMAGE_DIR, f'{id}{extension}')
                thumbnail_path = os.path.join(settings.THUMBNAIL_DIR, f'{id}{extension}')

                with open(file_path, 'wb+') as destination:
                    for chunk in imageFile.chunks():
                        destination.write(chunk)

                metadata = process_image(file_path=file_path)
                create_thumbnail(file_path, thumbnail_path)
                
                data['metadata'] = metadata
                data['thumbnail_path'] = f'/thumbnails/{id}{extension}'
                data['path'] = f'/images/{id}{extension}'
                # reserialize data
                imageSerializer = ImageSerializer(data=data, context = {'output': True})
                if imageSerializer.is_valid():
                    imageSerializer.save(custom_id=id)

                return Response(imageSerializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(imageSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # return error
        return Response({"error": "image or data not present"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            image = Image.objects.using(hash_to_partition(pk)).get(pk=pk)
        except:
            return Response({"error": "Image record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        imageFile = request.FILES.get('image')
        imageData = request.data.get('data', None)
        
        if imageData:
            # Process the JSON data for additional image details and update the record
            data = json.loads(imageData)
            # Here, you would update the existing image record with any new details provided
            # This could involve updating fields in a database record, for example
            # Assuming `ImageSerializer` handles validation and saving of data
            imageSerializer = ImageSerializer(data=data, context = {'output': False})
            
            if imageSerializer.is_valid():
    
                email_id = imageSerializer.data['owner']
                try:
                    user = User.objects.using('default').get(email_id = email_id)
                except:
                    return Response({"error": "Owner with email id not found"}, status=status.HTTP_400_BAD_REQUEST)
                self.check_object_permissions(request, user)
                
                metadata = image.metadata
                # update image file
                if imageFile:

                    # remove old file (image + thumbnail)
                    thumbnail_path = f'{settings.MEDIA_ROOT}{image.thumbnail_path}'.replace('\\', '/')
                    image_path = f'{settings.MEDIA_ROOT}{image.path}'.replace('\\', '/')

                    if os.path.exists(thumbnail_path):
                        os.remove(thumbnail_path)

                    if os.path.exists(image_path):
                        os.remove(image_path)

                    _, extension = os.path.splitext(imageFile.name)

                    file_path = os.path.join(settings.IMAGE_DIR, f'{pk}{extension}')
                    thumbnail_path = os.path.join(settings.THUMBNAIL_DIR, f'{pk}{extension}')

                    with open(file_path, 'wb+') as destination:
                        for chunk in imageFile.chunks():
                            destination.write(chunk)

                    metadata = process_image(file_path=file_path)
                    create_thumbnail(file_path, thumbnail_path)

                    data['thumbnail_path'] = f'/thumbnails/{pk}{extension}'
                    data['path'] = f'/images/{pk}{extension}'
                    data['viewcount'] = 0
                    data['metadata'] = metadata
                    
                imageSerializer.update(image, data)

                # ImageSerializer.data does not have the ids, the data is updated into the actual 'image' field
                # Hence using the ImageSerializer(image).data
                return Response(ImageSerializer(image, context = {'output': True}).data, status=status.HTTP_200_OK)
            else:
                return Response(imageSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # imageData not set
        return Response({"error": "data not present"}, status=status.HTTP_400_BAD_REQUEST)
