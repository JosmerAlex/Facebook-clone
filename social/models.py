from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

def user_directory_path(instance, filename):
    return 'users/socialposts/{0}'.format(filename)

class Image(models.Model):
    image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)

class SocialPost(models.Model):
    body=models.TextField()
    image= models.ManyToManyField('Image', blank=True)
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_post_author')
    likes = models.ManyToManyField(User, blank=True, related_name='post_likes_set')
    dislikes = models.ManyToManyField(User, blank=True, related_name='post_dislikes_set')

class SocialComment(models.Model):
    comment = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_comment_author')
    post = models.ForeignKey('SocialPost',  null=True, blank=True, on_delete=models.CASCADE, related_name='post_comment')
    likes = models.ManyToManyField(User, blank=True, related_name='comment_likes')
    dislikes = models.ManyToManyField(User, blank=True, related_name='comment_dislikes')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='+')

    @property
    def children(self):
        parent = SocialComment.objects.filter(parent=self).order_by('-created_on').all()
        return parent
    
    def parent_count(self):
        count = SocialComment.objects.filter(parent=self).all().count()
        return count

    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False