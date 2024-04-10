from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.GenericViewSet, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView):
    serializer_class=UserSerializer
    queryset = User.objects.all()

    def create_user(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

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
        if email:
            try:
                user = User.objects.get(email_id=email)
                user.delete()
                return Response({'message': 'User deleted successfully'})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response({"error": "not found"}, status=404)
        
    def retrieve(self, request, *args, **kwargs):
        email = kwargs.get('email_id', None)
        if email:
            instance = User.objects.get(email_id=email)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response({"error": "not found"}, status=404)
