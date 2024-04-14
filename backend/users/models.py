from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email_id, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        extra_fields.setdefault('is_user', True)

        if not email_id:
            raise ValueError('Users must have an email address')
        user = self.model(email_id=email_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email_id, password, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_user', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email_id, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email_id = models.EmailField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField(blank=True)

    # permission fields
    is_user = models.BooleanField(default=True, editable=False)
    is_staff = models.BooleanField(default=False, editable=False)
    is_superuser = models.BooleanField(default=False, editable=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email_id'
    REQUIRED_FIELDS = ['username', 'dob']  # 'password' is required by default

    def __str__(self):
        return self.email_id