from accounts.models import Profile
from django import forms

class EditProfileForm(forms.ModelForm):
    first_name = forms.CharField(
        widget=forms.TextInput(attrs={
            'class':'shadow-sm focus:ring-indigo-500 dark:bg-dark-third dark:text-dark-txt focus:border-indigo-500 block w-full sm:text-sm dark:border-dark-third border-gray-300 rounded-md',
            })
    )
    last_name = forms.CharField(
        widget=forms.TextInput(attrs={
            'class':'shadow-sm focus:ring-indigo-500 dark:bg-dark-third dark:text-dark-txt focus:border-indigo-500 block w-full sm:text-sm dark:border-dark-third border-gray-300 rounded-md',
            })
    )
    image = forms.ImageField(label='Profile Picture',required=False, widget=forms.FileInput(attrs={'class': 'sr-only', 'id': 'file-upload'}))
    banner = forms.ImageField(label='Banner Picture',required=False, widget=forms.FileInput(attrs={'class': 'sr-only', 'id': 'file-upload'}),)
    location = forms.CharField(widget=forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 dark:bg-dark-third dark:text-dark-txt focus:border-indigo-500 block w-full sm:text-sm dark:border-dark-third border-gray-300 rounded-md'}), max_length=25, required=False)
    url = forms.URLField(label='Website URL', widget=forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 dark:bg-dark-third dark:text-dark-txt focus:border-indigo-500 block w-full sm:text-sm dark:border-dark-third border-gray-300 rounded-md'}), max_length=60, required=False)
    bio = forms.CharField(widget=forms.Textarea(attrs={'class': 'shadow-sm block w-full rounded-md py-1.5 dark:bg-dark-third dark:text-dark-txt text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6', 'rows': 3}), max_length=260, required=False)
    birthday = forms.DateField(widget= forms.TextInput(attrs={'class': 'shadow-sm focus:ring-indigo-500 dark:bg-dark-third dark:text-dark-txt focus:border-indigo-500 block w-full sm:text-sm dark:border-dark-third border-gray-300 rounded-md'}), required=False)

    class Meta:
        model = Profile
        fields = ('first_name','last_name','image','banner','location','url','bio','birthday')
    
    def save(self, commit=True):
        data = {}
        form = super()
        try:
            if form.is_valid():
                form.save()
            else:
                data['error'] = form.errors
        except Exception as e:
            data['error'] = str(e)
        return data


