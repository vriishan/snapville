"""snapville URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from images.views import *
from uploads.views import *
from tags.views import *
from users.views import *
from django.conf.urls.static import static

from rest_framework.authtoken.views import obtain_auth_token


router = routers.DefaultRouter()

router.register(r'image', ImageViewSet, r"image")
router.register(r'tag', TagViewSet, basename="tag")
router.register(r'user', UserViewSet, basename='user')

urlpatterns = [
    # path(r'^users/', include(users.urls)),
    # path(r'^$/', index_view, {}, name='index'),

    # admin url
    path('admin/', admin.site.urls),

    # custom API routes
    path('api/$upload-image/', UploadViewSet.as_view({'post': 'create'}), name='upload-create'),
    path('api/$update-image/<uuid:pk>/', UploadViewSet.as_view({'put': 'update'}), name='upload-update'),
    path('api/image/<uuid:id>/', ImageViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('api/user/<str:email_id>/', UserViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='user-detail'),
    path('api/introspect/', UserViewSet.as_view({'get': 'introspect'}), name="introspect"),

    # login route
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),

    # main API/DRF routes
    path('api/', include(router.urls), name='api'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
