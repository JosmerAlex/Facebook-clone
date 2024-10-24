from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import os
from PIL import Image
from django.db.models.signals import post_save
# Create your models here.

def user_directory_path_profile(instance, filename):
    profile_image_name = 'users/{0}/profile.jpg'.format(instance.user.username)
    full_path = os.path.join(settings.MEDIA_ROOT, profile_image_name)

    if os.path.exists(full_path):
        os.remove(full_path)
    
    return profile_image_name

def user_directory_path_banner(instance, filename):
    profile_image_name = 'users/{0}/banner.jpg'.format(instance.user.username)
    full_path = os.path.join(settings.MEDIA_ROOT, profile_image_name)

    if os.path.exists(full_path):
        os.remove(full_path)
    
    return profile_image_name

VERIFICATION_OPTIONS=(
    ('unverified', 'unverified'),
    ('verified', 'verified')
)

class User(AbstractUser):
    stripe_customer_id = models.CharField(max_length=50, null=True, blank=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(default='users/user_default_profile.png', upload_to=user_directory_path_profile)
    banner = models.ImageField(default='users/user_default_bg.jpg', upload_to=user_directory_path_banner)
    verified = models.CharField(max_length=15, choices=VERIFICATION_OPTIONS, default='unverified')
    coins = models.DecimalField(max_digits=19, decimal_places=2, default=0, blank=False)
    date_joined = models.DateField(auto_now_add=True)
    location = models.CharField(max_length=50, null=True, blank=True)
    url =  models.CharField(max_length=80, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.user.username


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, created, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
