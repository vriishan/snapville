from rest_framework.permissions import BasePermission
from users.models import User
from images.models import Image

class IsSuperuser(BasePermission):
    """
    Custom permission to only allow superusers to access.
    """

    def has_permission(self, request, view):
        # Grant access only if the user is a superuser
        return request.user and request.user.is_superuser

class IsOwnerOrSuperuser(BasePermission):
    """
    Custom permission to only allow users of the object or superusers to access.
    """
    
    def has_object_permission(self, request, view, obj):
        # Check if the current user is the owner of the object or a superuser
        obj_check = False
        if isinstance(obj, Image):
            obj_check = obj.owner == request.user.email_id
        elif isinstance(obj, User):
            obj_check = obj == request.user
        return obj_check or request.user.is_superuser