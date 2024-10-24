from django.urls import path
from social.consumers import ManageCommentConsumer

websocket_urlpatterns = [
    path('ws/social/', ManageCommentConsumer.as_asgi()),
]