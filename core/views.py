from django.http.response import HttpResponse as HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.views.generic import TemplateView, View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.shortcuts import redirect, render, get_object_or_404
from django.core.paginator import Paginator
from django.urls.base import reverse_lazy
from social.models import Image, SocialPost
from django.utils import timezone
from datetime import datetime
from social.forms import SocialPostForm

class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'pages/index.html'
    success_url = reverse_lazy('home')

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        form = SocialPostForm(request.POST, request.FILES)
        files = request.FILES.getlist('image')
        print('FILES: ', files)
        print('BODY: ', request.POST.get('body'))
        context = self.get_context_data(**kwargs)
        try:
            print('SUCCESS ', datetime.now)
            if form.is_valid():
                new_post = form.save(commit=False)
                new_post.author_id = self.request.user.id
                #new_post.body = form.cleaned_data.get('body')
                new_post.save()
                for i in files:
                    print('SSASAS: ', i)
                    img = Image(image=i)
                    img.save() 
                    new_post.image.add(img)     
                new_post.save()
                return HttpResponseRedirect(self.success_url)
            self.object = None
        except Exception as e:
            HttpResponse('Error: ', form.errors)
        return render(request, self.template_name, context)
           
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = SocialPostForm()
        context['posts'] = SocialPost.objects.all().order_by('-id')
        context['user'] = self.request.user.username
        return context

# try:
#             print(action)
#             print(files)
#             if action == 'add':
#                 for i in files:
#                     print('IMAGESSS: ', i)
#                 if form.is_valid():
#                     print('FILES')
#                     new_post = form.save(commit=False)
#                     #new_post.body = self.request.user.id
#                     new_post.author_id = self.request.user.id
#                     new_post.save()
#                     for i in files:
#                         print('SSASAS: ', i)
#                         img = Image(image=i)
#                         img.save() 
#                         new_post.image.add(img)     
#                     data = new_post.save()
#         except Exception as e:
#             data['error'] = str(e)
#         return JsonResponse(data, safe=False)