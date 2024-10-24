from django.urls import path
from .views import PostEditView, PostDeleteView, PostDetailView, AddLike, AddDislike, Comments

app_name = 'social'

urlpatterns = [
    path('detail/<int:pk>/', PostDetailView.as_view(), name="post_detail"),
    path('edit/<int:pk>/', PostEditView.as_view(), name="post_edit"),
    path('delete/<int:pk>/', PostDeleteView.as_view(), name="post_delete"),
    path('comment/', Comments.as_view(), name="post_comment"),
    path('like/<int:pk>/', AddLike.as_view(), name="post_like"),
    path('dislike/<int:pk>/', AddDislike.as_view(), name="post_dislike"),
]