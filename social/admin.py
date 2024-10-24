from django.contrib import admin
from .models import SocialComment, SocialPost, Image

# Register your models here.


admin.site.register(SocialComment)
admin.site.register(SocialPost)
admin.site.register(Image)