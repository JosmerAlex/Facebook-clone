from django.urls import path
from .views import UserProfileView, UpdateProfileView

app_name = 'accounts'

urlpatterns = [
    path('profile/<str:username>/', UserProfileView.as_view(), name="profile"),
    path('profile/edit/<int:pk>/', UpdateProfileView.as_view(), name="profile_update"),
]