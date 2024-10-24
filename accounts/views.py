from typing import Any
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView, View, UpdateView
from .models import Profile
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import EditProfileForm
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.

class UserProfileView(View):

    def get(self, request, username,*args, **kwargs):
        user = get_object_or_404(User, username=username)
        profile = Profile.objects.get(user=user)

        context={
            'user':user,
            'profile':profile
        }
        return render(request, 'users/detail.html', context)
    
class UpdateProfileView(LoginRequiredMixin, UpdateView):
    model = Profile
    form_class = EditProfileForm
    template_name = 'users/edit_profile.html'

    def dispatch(self, request, *args, **kwargs):
        self.user_info = self.get_object()
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            if request.POST:
                profile = self.user_info
                user_basic_info = User.objects.get(id=profile.user.id)
                form = EditProfileForm(request.POST, request.FILES, instance=profile)
                if form.is_valid():
                    user_basic_info.first_name = form.cleaned_data.get('first_name')
                    user_basic_info.last_name = form.cleaned_data.get('last_name')

                    profile.image = form.cleaned_data.get('image')
                    profile.banner = form.cleaned_data.get('banner')
                    profile.location = form.cleaned_data.get('location')
                    profile.url = form.cleaned_data.get('url')
                    profile.birthday = form.cleaned_data.get('birthday')
                    profile.bio = form.cleaned_data.get('bio')

                    profile.save()
                    user_basic_info.save()
            else:
                data['error'] = 'No ha ingresado a ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return redirect('accounts:profile', user_basic_info.username)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.user_info
        return context
    
    






