import json
import os
from typing import Any
from django.shortcuts import render, redirect
from django.core.files import File
from django.http import JsonResponse
from django.utils.timesince import timesince
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse as HttpResponse, HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import UpdateView, DeleteView, DetailView, View
from django.urls.base import reverse_lazy
from .models import SocialPost, SocialComment, Image
from .forms import SocialPostForm, SocialCommentForm
from core.settings import MEDIA_URL, STATIC_URL, MEDIA_ROOT


class PostDetailView(LoginRequiredMixin, DetailView):
    template_name = 'detail.html'
    model = SocialPost

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs) 
     
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'load_comments':
                data = []
                detail = self.get_object()
                comments = detail.post_comment.filter(parent_id=None).order_by('-created_on')
                for i in comments:
                    data.append({
                        'id': i.id,
                        'comment': i.comment,
                        'author': i.author.username,
                        'author_id': i.author_id,
                        'author_image': i.author.profile.image.url,
                        'created_on': timesince(i.created_on),
                        'user_session': request.user.id,
                        'likes': i.likes.all().count(),
                        'dislikes': i.dislikes.all().count(),
                        'children': i.parent_count()
                    })
            
            elif action == 'view_replies':
                data = []
                id = request.POST['id']                
                answers = SocialComment.objects.filter(parent_id=id).order_by('-created_on')
                for i in answers:
                    data.append({
                        'id': i.id,
                        'comment': i.comment,
                        'author': i.author.username,
                        'author_id': i.author_id,
                        'author_image': i.author.profile.image.url,
                        'created_on': timesince(i.created_on),
                        'session_user': request.user.id,
                        'likes': i.likes.all().count(),
                        'dislikes': i.dislikes.all().count(),
                    })
            
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)
        context['form_comment'] = SocialCommentForm()
        context['like'] = self.get_object().likes.filter(id=self.request.user.id).exists()
        context['dislike'] = self.get_object().dislikes.filter(id=self.request.user.id).exists()
        return context
    
class PostEditView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    template_name='edit.html'
    model = SocialPost
    form_class = SocialPostForm
    success_url = reverse_lazy('home')

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)     

    def post(self, request, *args, **kwargs):
        form = SocialPostForm(request.POST, request.FILES)
        files = request.FILES.getlist('image')
        pk = self.kwargs['pk']
        try:
            if form.is_valid():
                post = SocialPost.objects.get(id=pk)
                post.body = request.POST.get('body')
                post.save()
                
                post.image.clear()
                for i in files:
                    img = Image(image=i)
                    img.save() 
                    post.image.add(img)     
                post.save()
        except Exception as e:
            HttpResponse('Error: ', form.errors)
        return HttpResponseRedirect(self.success_url)

    # def post(self, request, *args, **kwargs):
    #     data = {}
    #     #print('POST1: ',  request.POST['body'])
    #     print('POST2: ',  request.POST['body'])
    #     form = SocialPostForm(request.POST, request.FILES)
    #     files = request.FILES.getlist('image')
    #     print('FILES: ', files)
    #     pk = self.kwargs['pk']
    #     context = {'sas': 'asdsad'}
    #     try:
    #         if form.is_valid():
    #             post = form.save(commit=False)
    #             post.body = request.POST['body']
    #             post.save()

    #             if len(files):
    #                 post.image.clear()
    #                 for i in files:
    #                     print('SSASAS: ', i)
    #                     img = Image(image=i)
    #                     img.save() 
    #                     post.image.add(img)     
    #                 post.save()
    #             else:
    #                 print('EMPTY: ', len(files))

    #             return HttpResponseRedirect(self.success_url)
    #     except Exception as e:
    #         print('Error')
    #         # data['error'] = str(e)
    #     return render(request, self.template_name)


    #     # if action == 'edit':
    #     #     print('GET ', action)
    #     #     try:
    #     #         post = SocialPost.objects.get(pk=pk)
    #     #         print('POST: ',  request.POST['body'])
    #     #         post.body = request.POST.get('body')
    #     #         post.save()

    #     #         images = json.loads(request.POST['images'])
    #     #         archivo = request.FILES.getlist('image')
    #     #         print('GET IMAGE: ', archivo)

    #     #         if len(images):
    #     #             post.image.clear()
    #     #             for i in images:
    #     #                 name = i['name']
    #     #                 destino = os.path.join(MEDIA_ROOT+'\\users\\socialposts\\', name)

    #     #                 with open(destino, 'wb+') as destination:
    #     #                     for chunk in archivo.chunks():
    #     #                         destination.write(chunk)
    #     #                 file_path = self.user_directory_path(i['name'])
    #     #                 imagen = Image.objects.create(image=file_path)
    #     #                 post.image.add(imagen)
    #     #         else:
    #     #             print('EMPTY', len(images))

    #     #         data = {'url': f'/social/detail/{pk}/'}
    #     #     except Exception as e:
    #     #         data['error'] = str(e)
    #     #     return JsonResponse(data, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user.username
        return context

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author
    
class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model=SocialPost
    template_name='delete.html'
    success_url = reverse_lazy('home')

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author
    
class AddLike(LoginRequiredMixin, View):

    def post(self, request, pk, *args, **kwargs):
        post = SocialPost.objects.get(pk=pk)

        is_dislike = False

        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break

        if is_dislike:
            post.dislikes.remove(request.user)
        
        is_like = False
        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break
                
        if not is_like:
            post.likes.add(request.user)
        
        if is_like:
            post.likes.remove(request.user)
        
        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)

class AddDislike(LoginRequiredMixin, View):

    def post(self, request, pk, *args, **kwargs):
        post = SocialPost.objects.get(pk=pk)

        is_like = False

        for like in post.likes.all():
            if like == request.user:
                is_like = True
                break

        if is_like:
            post.likes.remove(request.user)
        
        is_dislake = False
        for dislike in post.dislikes.all():
            if dislike == request.user:
                is_dislake = True
                break
                
        if not is_dislake:
            post.dislikes.add(request.user)
        
        if is_dislake:
            post.dislikes.remove(request.user)
        
        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)

class Comments(LoginRequiredMixin, View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            print('ACTION: ', action)
            if action == 'add_comment':
                comment = request.POST['comment']
                print('POST AUTHOR: ', comment)
                post_id = request.POST['post_id']
                #comment = SocialPost.objects.get(pk=id)
                new_comment = SocialComment.objects.create(
                    comment=comment,
                    author=request.user,
                    post_id=int(post_id),
                )
                data = {'type': 'add_comment',
                        'comment': new_comment.comment, 
                        'created_on': timesince(new_comment.created_on), 
                        'author': new_comment.author.username,
                        'author_image': new_comment.author.profile.image.url,
                        'session_user': request.user.username
                        }
            
            elif action == 'reply':
                print('REPLY')
                comment = request.POST['comment']
                post_id = request.POST['post_id']
                comment_id = request.POST['comment_id']
                new_answer = SocialComment.objects.create(
                    comment=comment,
                    author=request.user,
                    post_id=int(post_id),
                    parent_id = int(comment_id)
                )
                data = {'type': 'reply',
                        'comment': new_answer.comment, 
                        'created_on': timesince(new_answer.created_on), 
                        'author': new_answer.author.username,
                        'author_image': new_answer.author.profile.image.url,
                        'session_user': request.user.username
                    }
            
            elif action == 'delete':               
                comment_id = request.POST['comment_id']
                print('COMMENT_ID: ', comment,)
                comment = SocialComment.objects.get(pk=int(comment_id))
                comment.delete()
                data = {'type': 'delete'}

            else:
                data['error'] = 'No ha ingresado a ninguna opción'

        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False)
        

    