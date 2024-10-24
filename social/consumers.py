import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince
from .models import *

class ManageCommentConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):        
        self.user_id = self.scope['user'].id
        self.room_group_name = 'comment'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        comment = text_data_json['comment']
        comment_id = text_data_json['comment_id']
        comment_position = text_data_json['comment_position']
        post_id = text_data_json['post_id']
        post_position = text_data_json['post_position']

        self.id_msg = comment_id

        if type == 'add_comment':

            new_comment = await self.create_comment(comment, post_id)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'insert_comment',
                    'author': new_comment['username'],
                    'author_id': self.user_id,
                    'author_image': new_comment['author_image'],
                    'comment': new_comment['comment'],
                    'comment_id': new_comment['comment_id'],
                    'created_on': timesince(new_comment['created_on']),
                }
            )
        
        elif type == 'reply':
            new_response = await self.create_response(comment, post_id, comment_id)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'reply_comment',
                    'author': new_response['username'],
                    'author_id': self.user_id,
                    'author_image': new_response['author_image'],
                    'comment': new_response['comment'],
                    'comment_id': new_response['comment_id'],
                    'comment_position': comment_position,
                    'created_on': timesince(new_response['created_on']),
                }
            )

        elif type == 'delete_comment':
            comment_delete = await self.delete_comment(comment_id)

            if comment_delete == 'SUCCESS':
                await self.channel_layer.group_send(
                    self.room_group_name, {
                        'type': 'delete_msg',
                        'comment_position': comment_position,
                        'comment_id': self.id_msg
                    }
            )

        elif type == 'like_post':
            data = await self.like_post(post_id)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'like_post_client',
                    'post_position': post_position,
                    'like': data['is_like'],
                    'like_count': data['like_count'],
                    'dislike': data['is_dislike'],
                    'dislike_count': data['dislike_count']
                }
            )
        
        elif type == 'dislike_post':
            data = await self.dislike_post(post_id)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'dislike_post_client',
                    'post_position': post_position,
                    'like': data['is_like'],
                    'like_count': data['like_count'],
                    'dislike': data['is_dislike'],
                    'dislike_count': data['dislike_count']
                }
            )

    async def insert_comment(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'author': event['author'],
            'author_id': event['author_id'],
            'author_image': event['author_image'],
            'comment': event['comment'],
            'comment_id': event['comment_id'],
            'created_on': event['created_on'],
        }))
    
    async def reply_comment(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'author': event['author'],
            'author_id': event['author_id'],
            'author_image': event['author_image'],
            'comment': event['comment'],
            'comment_id': event['comment_id'],
            'comment_position': event['comment_position'],
            'created_on': event['created_on'],
        }))
    
    async def delete_msg(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'comment_position': event['comment_position'],
            'comment_id': event['comment_id'],
        }))

    async def like_post_client(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'post_position': event['post_position'],
            'like': event['like'],
            'like_count': event['like_count'],
            'dislike': event['dislike'],
            'dislike_count': event['dislike_count'],
        }))
    
    async def dislike_post_client(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'post_position': event['post_position'],
            'like': event['like'],
            'like_count': event['like_count'],
            'dislike': event['dislike'],
            'dislike_count': event['dislike_count'],
        }))

    @sync_to_async
    def create_comment(self, comment, post_id):
        comment = SocialComment.objects.create(
            comment=comment, 
            post_id=int(post_id), 
            author_id=self.user_id
        )
        data = {'comment': comment.comment, 
                'comment_id': comment.id,
                'created_on': comment.created_on,
                'username': comment.author.username,
                'author_image': comment.author.profile.image.url
            }
        return data
    
    @sync_to_async
    def create_response(self, comment, post_id, comment_id):
        comment = SocialComment.objects.create(
            comment=comment, 
            post_id=int(post_id), 
            author_id=self.user_id,
            parent_id=int(comment_id)
        )
        data = {'comment': comment.comment, 
                'comment_id': comment.id,
                'created_on': comment.created_on,
                'username': comment.author.username,
                'author_image': comment.author.profile.image.url
            }
        return data
    
    
    @sync_to_async
    def delete_comment(self, id_comment):
        comment = SocialComment.objects.get(pk=id_comment)
        comment.delete()
        return 'SUCCESS'
    
    @sync_to_async
    def like_post(self, post_id):        
        post = SocialPost.objects.get(pk=post_id)

        is_dislike = post.dislikes.filter(id=self.user_id).exists()
        is_like = post.likes.filter(id=self.user_id).exists()
        dislike_count = post.dislikes.all().count()
        like_count = post.likes.all().count()

        if is_dislike:
            post.dislikes.remove(self.user_id)

        if not is_like:
            post.likes.add(self.user_id)
        
        elif is_like:
            post.likes.remove(self.user_id)
        
        data = {'is_like': is_like, 'like_count': like_count, 'is_dislike': is_dislike, 'dislike_count': dislike_count}

        return data

    @sync_to_async
    def dislike_post(self, post_id):        
        post = SocialPost.objects.get(pk=post_id)

        is_dislike = post.dislikes.filter(id=self.user_id).exists()
        is_like = post.likes.filter(id=self.user_id).exists()
        dislike_count = post.dislikes.all().count()
        like_count = post.likes.all().count()

        if is_like:
            post.likes.remove(self.user_id)

        if not is_dislike:
            post.dislikes.add(self.user_id)
        
        elif is_dislike:
            post.dislikes.remove(self.user_id)
        
        data = {'is_like': is_like, 'like_count': like_count, 'is_dislike': is_dislike, 'dislike_count': dislike_count}

        return data
        

