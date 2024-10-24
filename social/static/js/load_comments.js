let comment_observer = new IntersectionObserver((target) => {
    target.forEach(element => {
        if (element.isIntersecting) {
            loadComments();
        }
    })
 
}, {
    rootMargin: '0px',
    threshold: 1.0
})

const showSpinner = () => {
    const spinner = `
    <div class="flex justify-center items-center space-x-2 py-1">
        <div role="status" class="spinner">
        <svg width="24" height="24" stroke="#4285f4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3" stroke-linecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
        </div>
    </div>`
return spinner;
};

const hideSpinner = () => {
const spinner = document.querySelector('.spinner');
return spinner.classList.add('hidden');
};

const idsExclude = () => {
    let arrayId = []
    const commentId = document.querySelectorAll('.comment');
    commentId.forEach(id => arrayId.push(id.getAttribute('data-id')))
    return arrayId;
};

const loadComments = async() => {
    const url = window.location.pathname
    const parameters = new FormData();
    parameters.append('action', 'load_comments')
    const options = {
        method: 'POST',
        body: parameters,
    };
    const contentComment = document.getElementById("content_comment");
    try {
        contentComment.innerHTML = showSpinner();
        const response = await fetch(url, options);
        const data = await response.json();
        let html = '';
        data.map(comment => {
            html += `
            <div class="flex space-x-2 comment py-1" data-id="${comment.id}">
                <a href="/users/profile/${comment.author}/">
                    <img src="${comment.author_image}" alt="Profile picture" class="w-9 h-9 rounded-full">
                </a>
                <div>
                    <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm pr-">
                        <a href="/users/profile/${comment.author}/"
                            class="font-semibold block hover:text-blue-500 dark:text-dark-txt w-16">
                            <p>${comment.author}</p>
                        </a>
                        <span class="dark:text-dark-txt text_comment">${comment.comment}</span>
                        <span
                            class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">${comment.created_on}</span>
                    </div>
                    <div class=" text-xs text-gray-500 dark:text-dark-txt mt-1 options">
                        ${data.author_id === data.user_session ? 
                            `<div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                                <i class='bx bxs-edit-alt'></i> <span>Edit</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                                <i class='bx bxs-trash-alt delete'></i> <span class="delete">Delete</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>` : ``                       
                        }                        
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                <i class='bx bxs-like'></i><span>${comment.likes}</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                <i class='bx bxs-dislike'></i><span>${comment.dislikes}</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <button @click="open = true"
                            class="inline-flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt reply">
                            <i class='mr-1 bx bxs-comment'></i> Reply
                        </button>
                    </div>
                    ${comment.children > 0 ? `                        
                        <div class="answers">
                            <div class="flex space-x-2 pt-1 font-semibold">
                                <button type="button"
                                    class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-sm py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt view_replies">
                                    <i class='bx bxs-chevron-down view_replies'></i> <span class="view_replies">${comment.children} Answers</span>
                                    <p class="text-sm font-semibold"></p>
                                </button>
                            </div>
                        </div>
                    ` : ``} 
                    <div class="content_reply">
                        
                    </div>  
                </div>
            </div>`
        });
        contentComment.innerHTML = html;
    } catch (error) {
        contentComment.innerHTML = `
        <div class="flex justify-center items-center space-x-2 py-1">
            <h1 class="dark:text-dark-txt text-gray-500">${error}</h1>
        </div>`
        console.error(error);
    }
};

const loadMoreComments = async() => {
    const url = window.location.pathname;
    const parameters = new FormData();
    parameters.append('action', 'load_more_comments');
    parameters.append('ids', idsExclude());
    const options = {
        method: 'POST',
        body: parameters
    }
    const response = await fetch(url, options);
    const data = await response.json();
    let html = '';
        console.log(data)
        data.map(comment => {
            html += `
            <div class="flex space-x-2 comment py-1" data-id="${comment.id}">
                <a href="/users/profile/${comment.author}/">
                    <img src="${comment.author_image}" alt="Profile picture" class="w-9 h-9 rounded-full">
                </a>
                <div>
                    <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm pr-">
                        <a href="/users/profile/${comment.author}/"
                            class="font-semibold block hover:text-blue-500 dark:text-dark-txt w-16">
                            <p>${comment.author}</p>
                        </a>
                        <span class="dark:text-dark-txt text_comment">${comment.comment}</span>
                        <span
                            class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">${comment.created_on}</span>
                    </div>
                    <div class=" text-xs text-gray-500 dark:text-dark-txt mt-1 options">
                        ${data.author_id === data.user_session ? 
                            `<div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                                <i class='bx bx-edit-alt'></i> <span>Edit</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-1 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                                <i class='bx bx-trash-alt delete'></i> <span class="delete">Delete</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>` : ``                       
                        }                        
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                <i class='bx bx-like'></i><span>${comment.likes}</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <div class="inline-flex">
                            <button type="button"
                                class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                <i class='bx bx-dislike'></i><span>${comment.dislikes}</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                        <button @click="open = true"
                            class="inline-flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt reply">
                            <i class='mr-1 bx bx-comment'></i> Reply
                        </button>
                    </div>
                    <div class="view"></div>
                    <div class="content_reply">
                    ${comment.children > 0 ? `                        
                        <div class="flex space-x-2 pt-1 font-semibold">
                            <button type="button"
                                class=" flex space-x-1 w-96 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-sm py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt view_replies">
                                <i class='bx bxs-chevron-down view_replies'></i> <span class="view_replies">${comment.children} Answers</span>
                                <p class="text-sm font-semibold"></p>
                            </button>
                        </div>
                    ` : ``}     
                    </div>  
                </div>
            </div>`
        });
}

/* <a href="{% url 'accounts:profile' comment.author.username %}">
                                <img src="{{child_comment.author.profile.image.url}}" alt="Profile picture"
                                    class="w-9 h-9 rounded-full">
                            </a>
                            <div>
                                <div class="bg-gray-100 dark:bg-dark-third p-2 rounded-2xl text-sm">
                                    <a href="{% url 'accounts:profile' comment.author.username %}"
                                        class="font-semibold block hover:text-blue-500 dark:text-dark-txt">
                                        <p>{{child_comment.author}}</p>
                                    </a>
                                    <span class="dark:text-dark-txt ">{{child_comment.comment}}</span>
                                    <span class="text-xs dark:text-dark-txt text-gray-500 float-right pl-2">{{child_comment.created_on|naturaltime}}</span>
                                </div>
                                <div class="py-1 text-xs text-gray-500 dark:text-dark-txt">
                                    {% if request.user == child_comment.author %}
                                    <div class="pl-1 inline-flex">
                                        <button type="button"
                                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt edit">
                                            <i class='bx bx-edit-alt'></i> <span> Edit</span>
                                            <p class="text-sm font-semibold"></p>
                                        </button>
                                    </div>
                                    <div class="pl-1 inline-flex">
                                        <button type="button"
                                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt delete">
                                            <i class='bx bx-trash-alt'></i> <span> Delete</span>
                                            <p class="text-sm font-semibold"></p>
                                        </button>
                                    </div>
                                    {% endif %}
                                    <div class="pl-1 inline-flex">
                                        <button type="button"
                                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                            <i class='bx bx-like'></i><span>{{child_comment.likes.all.count}}</span>
                                            <p class="text-sm font-semibold"></p>
                                        </button>
                                    </div>
                                    <div class=" inline-flex">
                                        <button type="button"
                                            class=" flex space-x-2 justify-center items-center hover:bg-gray-100 dark:hover:bg-dark-third text-xs py-1 px-1 rounded-lg cursor-pointer text-gray-500 dark:text-dark-txt">
                                            <i
                                                class='bx bx-dislike'></i><span>{{child_comment.dislikes.all.count}}</span>
                                            <p class="text-sm font-semibold"></p>
                                        </button>
                                    </div>
                                </div>
                            </div> */
