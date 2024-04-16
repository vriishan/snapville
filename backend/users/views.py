from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from .models import User
from .serializers import UserSerializer
from user_images.models import UserImage
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from snapville.permissions import IsSuperuser, IsOwnerOrSuperuser

class UserViewSet(viewsets.GenericViewSet, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView):
    serializer_class=UserSerializer
    queryset = User.objects.all()

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method in ["POST"]:
            return [AllowAny()]
        if self.request.method in ["DELETE"]:
            return [IsSuperuser()]  # Only allow admin users to POST or DELETE
        
        if self.action == 'introspect':
            return [IsAuthenticated()]

        if self.request.method in ["GET"] and 'email_id' not in self.kwargs:
            return [IsSuperuser()]
        elif self.request.method in ["GET"] and 'email_id' in self.kwargs:
            return [IsOwnerOrSuperuser()]
        
        return [IsAuthenticated()]  # All other methods are allowed for authenticated users


    def put(self, request, *args, **kwargs):
        email_id = request.data.get('email_id')
        try:
            user = User.objects.get(email_id=email_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        username = request.data.get('username')
        if username and username != user.username:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=400)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    def destroy(self, request, *args, **kwargs):
        email = kwargs.get('email_id', None)
        self.check_object_permissions(request, email)
        if email:
            try:
                user = User.objects.get(email_id=email)
                user.delete()
                UserImage.objects.using('default').filter(user_id=email).delete()
                return Response({'message': 'User deleted successfully'})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response({"error": "not found"}, status=404)
    

    def retrieve(self, request, *args, **kwargs):
        email = kwargs.get('email_id', None)
        if email:
            instance = User.objects.get(email_id=email)
            self.check_object_permissions(request, instance)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response({"error": "not found"}, status=404)
    
    def introspect(self, request, *args, **kwargs):
        user = request.user
        user_data = UserSerializer(user).data
        user_data['is_admin'] = user.is_superuser
        return Response(user_data)
