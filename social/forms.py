from django import forms
from django.http.response import HttpResponse as HttpResponse
from .models import SocialPost, SocialComment


class SocialPostForm(forms.ModelForm):
    class Meta:
        model=SocialPost
        fields='body', 'image'

    body = forms.CharField(widget=forms.Textarea(attrs={
            'class': 'shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 dark:bg-dark-third dark:border-dark-third dark:text-dark-txt flex max-w-full sm:text-sm border-gray-300 rounded-md',
            'rows': '3',
            'placeholder': 'Say Something...',
            'id': 'body'
            }),
        required=True)

    image = forms.FileField(widget=forms.ClearableFileInput(attrs={
        'class': 'relative w-full dark:text-dark-txt dark:bg-dark-third cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500',
        'multiple': True,
        'id': 'image',
        'required': False
        }),
    )
    exclude = ['created_on']


class SocialCommentForm(forms.ModelForm):

    class Meta:
        model=SocialComment
        fields = 'comment',

    comment = forms.CharField(widget=forms.Textarea(attrs={
            'class': 'shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 dark:bg-dark-third dark:border-dark-third dark:text-dark-txt flex max-w-full sm:text-sm border-gray-300 rounded-md',
            'rows': '3',
            'placeholder': 'Say Something...',
            'id': 'comment'
            }),
        required=True)

