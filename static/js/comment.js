const contentPosts = document.getElementById("content_posts");
const commentForm = document.getElementById("commentForm");
const commentModal = document.getElementById("commentModal");
const btnHide = document.getElementById("btnHide");

let idPost = "";
let position = "";
let idComment = "";
let type = "";

const commentHtml = (data, session_user) => {
  const comment = `<a href="/users/profile/${data.author}/">
    <img src="${
      data.author_image
    }" alt="Profile picture" class="w-9 h-9 rounded-full">
    </a>
    <div>
        <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
            <a href="/users/profile/${data.author}/"
                class="font-semibold block hover:text-blue-500 dark:text-dark-txt w-16">
                <p>${data.author}</p>
            </a>
            <span class="dark:text-dark-txt">${data.comment}</span>
            <span class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">${
              data.created_on
            }</span>
        </div>
        <div class="text-xs text-gray-500 dark:text-dark-txt mt-1 options">
            ${
              data.author_id == session_user ? `
            <div class="inline-flex">
                        <button type="button"
                            class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                            <i class='bx bx-edit-alt'></i> <span>Edit</span>
                            <p class="text-sm font-semibold"></p>
                        </button>
                    </div>
                    <div class="inline-flex">
                        <button type="button"
                            class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                            <i class='bx bx-trash-alt'></i> <span>Delete</span>
                            <p class="text-sm font-semibold"></p>
                        </button>
                    </div>`
                : ``
            }
            <div class="inline-flex">
                        <button type="button"
                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                            <i class='bx bx-like'></i><span>0</span>
                            <p class="text-sm font-semibold"></p>
                        </button>
                    </div>    
                    <div class="inline-flex">
                        <button type="button"
                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                            <i class='bx bx-dislike'></i><span>0</span>
                            <p class="text-sm font-semibold"></p>
                        </button>
              </div>         
              <button @click="open = true"
                class="inline-flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt reply">
                <i class='mr-1 bx bx-comment'></i> Reply
              </button>                    
        </div>
    </div>`;
  return comment;
};

const replyCommentHtml = (data, session_user) => {
  const commentReply = `<div class="flex space-x-2 pt-1">
    <a href="/users/profile/${data.author}/">
        <img src="${data.author_image}" alt="Profile picture"
            class="w-9 h-9 rounded-full">
    </a>
    <div>
        <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
            <a href="/users/profile/${data.author}/"
                class="font-semibold block hover:text-blue-500 dark:text-dark-txt">
                <p>${data.author}</p>
            </a>
            <span class="dark:text-dark-txt">${data.comment}</span>
            <span
                class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">${
                  data.created_on
                }</span>
        </div>
        <div class="py-1 text-xs text-gray-500 dark:text-dark-txt">
        ${
          data.author_id == session_user ? `
                <div class="pl-1 inline-flex">
                    <button type="button"
                        class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                        <i class='bx bx-edit-alt'></i> <span>Edit</span>
                        <p class="text-sm font-semibold"></p>
                    </button>
                </div>
                <div class="pl-1 inline-flex">
                    <button type="button"
                        class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                        <i class='bx bx-trash-alt'></i> <span>Delete</span>
                        <p class="text-sm font-semibold"></p>
                    </button>
                </div>`
            : `` 
          }
             <div class="pl-1 inline-flex">
                <button type="button"
                    class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                    <i class='bx bx-like'></i><span>0</span>
                    <p class="text-sm font-semibold"></p>
                </button>
            </div>
            <div class="inline-flex">
                <button type="button"
                    class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                    <i class='bx bx-dislike'></i><span>0</span>
                    <p class="text-sm font-semibold"></p>
                </button>
            </div>            
        </div>
    </div>
    </div>`;
  return commentReply;
};

const addComment = (data) => {
  const contentComment = document.getElementById("content_comment");

  const firstComment = contentComment.firstChild;
  const div = document.createElement("div");
  const session_user = document.getElementById("user").value;
  div.classList.add("flex", "space-x-2", "py-1");

  div.innerHTML = commentHtml(data, session_user);
  return contentComment.insertBefore(div, firstComment);
};

const managePost = (data) => {
  console.log(data);
  try {
    if (data.type === 'insert_comment') {

      addComment(data);
    
    } else if (data.type === 'reply_comment') {
      const session_user = document.getElementById("user").value;

      const contentReply = document.querySelector(
        "div.content_comment div.comment:nth-child(" + (data.comment_position + 1) + ")"
      );
      contentReply.querySelector(".content_reply").innerHTML +=
        replyCommentHtml(data, session_user);

    
    } else if (data.type === 'delete_msg') {

      const comment = document.querySelector("div.content_comment div.comment:nth-child("+(data.comment_position + 1)+")");
      comment.querySelector('.text_comment').textContent = 'Mensaje Eliminado';
      comment.querySelector('.options').remove();
      comment.querySelector('.content_reply').remove();
    } else if (data.type === 'like_post_client'){

      const post = document.querySelector("div.post:nth-child(" + (data.post_position + 1) + ")");
      let btnLike = post.querySelector('div.options_post button.btn_like')
      let btnDislike = post.querySelector('div.options_post button.btn_dislike')


      if (data.dislike) {

        btnDislike.classList.remove('text-red-400', 'bg-red-600/20', 'dark:bg-red-600/20', 'dark:text-red-400')
        btnDislike.classList.add('text-gray-500', 'dark:text-dark-txt')
        btnDislike.querySelector('i.ping-like').classList.remove('animate-custom-ping')
        post.querySelector('span.dislike_count').textContent = data.dislike_count - 1

      }

      if (data.like === false){

        btnLike.classList.remove('text-gray-500', 'dark:text-dark-txt')
        btnLike.classList.add('bg-blue-600/20', 'text-blue-400', 'dark:bg-blue-600/20', 'dark:text-blue-400')
        btnLike.querySelector('i.ping-like').classList.add('animate-custom-ping')
        post.querySelector('span.like_count').textContent = data.like_count + 1
      }
      
      else if (data.like){
        
        btnLike.classList.remove('bg-blue-600/20', 'text-blue-400', 'dark:bg-blue-600/20', 'dark:text-blue-400')
        btnLike.classList.add('text-gray-500', 'dark:text-dark-txt')
        btnLike.querySelector('i.ping-like').classList.remove('animate-custom-ping')
        post.querySelector('span.like_count').textContent = data.like_count - 1

      }
      
    } else if (data.type === 'dislike_post_client'){

      const post = document.querySelector("div.post:nth-child(" + (data.post_position + 1) + ")");
      let btnLike = post.querySelector('div.options_post button.btn_like')
      let btnDislike = post.querySelector('div.options_post button.btn_dislike')

      if (data.like){

        btnLike.classList.remove('bg-blue-600/20', 'text-blue-400', 'dark:bg-blue-600/20', 'dark:text-blue-400')
        btnLike.classList.add('text-gray-500', 'dark:text-dark-txt')
        btnLike.querySelector('i.ping-like').classList.remove('animate-custom-ping')
        post.querySelector('span.like_count').textContent = data.like_count - 1

      }
      if (data.dislike === false){

        btnDislike.classList.remove('text-gray-500', 'dark:text-dark-txt')
        btnDislike.classList.add('text-red-400', 'bg-red-600/20', 'dark:bg-red-600/20', 'dark:text-red-400')
        btnDislike.querySelector('i.ping-like').classList.add('animate-custom-ping')
        post.querySelector('span.dislike_count').textContent = data.dislike_count + 1
      }

      else if (data.dislike) {

        btnDislike.classList.remove('text-red-400', 'bg-red-600/20', 'dark:bg-red-600/20', 'dark:text-red-400')
        btnDislike.classList.add('text-gray-500', 'dark:text-dark-txt')
        btnDislike.querySelector('i.ping-like').classList.remove('animate-custom-ping')
        post.querySelector('span.dislike_count').textContent = data.dislike_count - 1

      }      
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

let socket = new WebSocket(`ws://${window.location.host}/ws/social/`);
socket.onmessage = function (e) {
  console.log("onMessage");
  managePost(JSON.parse(e.data));
};
socket.onopen = function (e) {
  console.log("CONNECTION ESTABLISHED");
};
socket.onclose = function (e) {
  console.log("CONNECTION LOST");
};
socket.onerror = function (e) {
  console.log(e);
};

const sendComment = (data) => {
  socket.send(
    JSON.stringify({
      type: data.type,
      comment: data.comment,
      comment_id: data.comment_id,
      comment_position: data.comment_position,
      post_id: data.post_id,
      post_position: '',
    })
  );
};

const deleteComment = (idComment) => {
  try {
    socket.send(
      JSON.stringify({
        type: 'delete_comment',
        comment: '',
        post_id: '',
        comment_id: idComment,
        comment_position: position,
        post_position: '',
      })
    );
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

const likePost = (idPost, post_position) => {
  try {
    socket.send(
      JSON.stringify({
        type: 'like_post',
        comment: '',
        post_id: idPost,
        comment_id: '',
        comment_position: '',
        post_position: post_position,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const dislikePost = (idPost, post_position) => {
  try {
    socket.send(
      JSON.stringify({
        type: 'dislike_post',
        comment: '',
        post_id: idPost,
        comment_id: '',
        comment_position: '',
        post_position: post_position,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const viewAnswers = async(idComment) => {

  const url = window.location.pathname;
  const parameters = new FormData();
  parameters.append('action', 'view_replies');
  parameters.append('id', idComment);
  const contentReply = document.querySelector("div.content_comment div.comment:nth-child(" + (position + 1) + ")")
  .querySelector(".content_reply");

  const options = {
      method: 'POST',
      body: parameters
  }
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    
    contentReply.innerHTML = showSpinner();
  let html = '';
  data.map(comment => {
    html += `<div class="flex space-x-2 pt-1">
    <a href="/users/profile/${comment.author}/">
        <img src="${comment.author_image}" alt="Profile picture"
            class="w-9 h-9 rounded-full">
    </a>
    <div>
        <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
            <a href="/users/profile/${comment.author}/"
                class="font-semibold block hover:text-blue-500 dark:text-dark-txt">
                <p>${comment.author}</p>
            </a>
            <span class="dark:text-dark-txt">${comment.comment}</span>
            <span
                class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">${
                  comment.created_on
                }</span>
        </div>
        <div class="py-1 text-xs text-gray-500 dark:text-dark-txt">
        ${
          comment.author_id == comment.session_user ? `
                <div class="pl-1 inline-flex">
                    <button type="button"
                        class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                        <i class='bx bx-edit-alt'></i> <span>Edit</span>
                        <p class="text-sm font-semibold"></p>
                    </button>
                </div>
                <div class="pl-1 inline-flex">
                    <button type="button"
                        class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                        <i class='bx bx-trash-alt'></i> <span>Delete</span>
                        <p class="text-sm font-semibold"></p>
                    </button>
                </div>`
            : `` 
          }
             <div class="pl-1 inline-flex">
                <button type="button"
                    class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                    <i class='bx bx-like'></i><span>0</span>
                    <p class="text-sm font-semibold"></p>
                </button>
            </div>
            <div class="inline-flex">
                <button type="button"
                    class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                    <i class='bx bx-dislike'></i><span>0</span>
                    <p class="text-sm font-semibold"></p>
                </button>
            </div>            
        </div>
    </div>
    </div>`
  })
  setTimeout(() => {
    contentReply.innerHTML = html;
  }, 300);
  } catch (error) {
    contentReply.innerHTML = `<div class="grid place-items-center dark:text-dark-txt text-gray-500 text-xs">Error al cargar los comentarios: ${error}</div>`
  }
  
}

const eventComment = (element) => {
  let post = element.closest("div.post");
  idPost = post.querySelector('input[name="post_id"]').value;
  type = "add_comment";
};

const eventResponseComment = (element) => {
    let comment = element.closest("div.comment");
    idComment = comment.getAttribute("data-id");
    idPost = comment.closest("div.post").querySelector('input[name="post_id"]').value;
    position = Array.from(comment.parentNode.children).indexOf(comment);
    type = "reply";
};

const eventDeleteComment = (element) => {
  const comment = element.closest("div.comment");
  idComment = comment.getAttribute("data-id");
  position = Array.from(comment.parentNode.children).indexOf(comment);
  deleteComment(idComment);
};

const eventLikePost = (element) => {
  const post = element.closest("div.post");
  idPost = post.querySelector('input[name="post_id"]').value;
  let post_position = Array.from(post.parentNode.children).indexOf(post);
  likePost(idPost, post_position);
};

const eventDislikePost = (element) => {
  const post = element.closest("div.post");
  idPost = post.querySelector('input[name="post_id"]').value;
  let post_position = Array.from(post.parentNode.children).indexOf(post);
  dislikePost(idPost, post_position);
};

const eventViewAnswers = (element) => {
  const comment = element.closest("div.comment");
  idComment = comment.getAttribute("data-id");
  const children = comment.querySelector('.content_reply')
  position = Array.from(comment.parentNode.children).indexOf(comment);

if (children.childNodes.length > 1) {
    children.classList.toggle('hidden')
    return false;
  } else {
    viewAnswers(idComment);
  }
};

contentPosts.addEventListener("click", (event) => {

  let target = event.target;

  if (target.classList.contains("add_comment")) {

    eventComment(target);

  } else if (target.classList.contains("reply")) {

    eventResponseComment(target);    

  } else if (target.classList.contains("delete")) {
    
    eventDeleteComment(target);

  } else if (target.classList.contains("btn_like")) {

    eventLikePost(target);

  } else if (target.classList.contains("btn_dislike")) {
    
    eventDislikePost(target);

  } else if (target.classList.contains("view_replies")) {
    
    eventViewAnswers(target);

  }
});

commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const comment = e.target.comment.value;

  socket.send(
    JSON.stringify({
      type: type,
      comment: comment,
      post_id: idPost,
      comment_id: idComment,
      comment_position: position,
      post_position: '',
    })
  );  
});

// const onSubmit = (e) => {
//   e.preventDefault();
//   const comment = e.target.comment.value;
//   const parameters = new FormData();
//   parameters.append("comment_id", idComment);
//   parameters.append("type", type);
//   parameters.append("comment", comment);
//   parameters.append("post_id", idPost);
//   console.log("submit: ", parameters);
//   manageComment(parameters);
// };

// const submitFormReply = () => {
//   if (commentFormReply) {
//     console.log("EXISTE");
//     commentFormReply.removeEventListener("submit", onSubmit);
//   }

//   commentFormReply = replyComment.querySelector("form");
//   commentFormReply.addEventListener("submit", onSubmit);
// };