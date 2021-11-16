
const state = {
    inputTitle: "",
    inputImage: "",
    selectedComment: null,
    posts: []
}


// update Like==================================================
const updateLikes = (num,id) => {
    fetch(`http://localhost:3000/images/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ likes: num })
    })
}

// listen To Like Buttons=========================================
const listenToLikeButton = () => {
    const likeBtn = document.querySelectorAll('.like-button');
    likeBtn.forEach(btn => {
        const previous = btn.previousElementSibling;
        const tempArr = previous.innerText.split(' ');
        let num = Number(tempArr[0]);
        btn.addEventListener('click', () => {
            const likeId = btn.id
            num ++
            previous.innerText = num + ' likes'
            updateLikes(num,likeId);
        })
    })
}


// listen to delete post button ===============================
function listenToDeletePostBtn(post){
    fetch(`http://localhost:3000/images/${post.id}`, {
        method: 'DELETE'
    })
}


// listen to comment button======================================
const listenToCommentButton = (form,commentInput,post) => {
    form.addEventListener('submit',(e) => {
        e.preventDefault();
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "content": commentInput.value,
                "imageId": post.id
            })
        })
    })
}

// render comment form===========================================
const renderCommentForm = (post,article) => {
    const form = document.createElement('form');
    form.classList.add('comment-form')
    const commentInput = document.createElement("input");
    const commentButton = document.createElement("button");

    commentInput.setAttribute("class","comment-input");
    commentInput.setAttribute("type","text");
    commentInput.setAttribute("name","comment");
    commentInput.setAttribute("placeholder","Add a comment...");

    commentButton.setAttribute("class","comment-button");
    commentButton.setAttribute("type","submit");
    commentButton.innerText = "Post";

    form.append(commentInput,commentButton);
    article.insertAdjacentElement('beforeend',form);
    listenToCommentButton(form,commentInput,post)
}

// listen to delete comment=====================================
const listenToDeletecomment = (comment) => {
    fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: 'DELETE'
    });
}

// render comment=============================================
const renderCommentListItem = (comment) => {
    const listContainer = document.createElement('div');
    listContainer.classList.add('list-container');
    listContainer.setAttribute('dataId', `${comment.id}`);
    const listItem = document.createElement('li');
    listItem.classList.add('listEl');
    listItem.innerText= `${comment.content}`;
    const deleteComment = document.createElement('span');
    deleteComment.classList.add('delete-comment');
    deleteComment.innerHTML = `<i class="fas fa-trash-alt"></i>`
    listContainer.append(listItem,deleteComment);
    deleteComment.addEventListener('click', () => {
        state.selectedComment = comment;
        listenToDeletecomment(comment);
    })
    return listContainer
}


// render cards====================================================
const renderCards = (post) => {
    const imageContainer = document.querySelector('.image-container')
    const article = document.createElement('article');
    article.setAttribute('postId',`${post.id}`);
    article.classList.add('image-card');
    imageContainer.append(article);

    const container = document.createElement('div');
    container.classList.add('container');
    const h2El = document.createElement('h2');
    h2El.classList.add('title');
    h2El.innerText = `${post.title}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-post');
    deleteBtn.innerHTML = `<i class="fas fa-ellipsis-h"></i>`
    container.append(h2El,deleteBtn);
    deleteBtn.addEventListener('click',() => {
        state.inputTitle = post;
        console.log('deletePost: ', state);
        listenToDeletePostBtn(post);
    })

    const image = document.createElement('img');
    image.classList.add('image');
    image.src = `${post.image}`;

    const likeSection = document.createElement('div');
    likeSection.classList.add('likes-section');
    const likes = document.createElement('span');
    likes.classList.add('likes');
    likes.innerText = `${post.likes} likes`;
    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.setAttribute('id', `${post.id}`);
    likeButton.innerText = '♥';
    likeSection.append(likes,likeButton);
    
    article.append(container,image,likeSection);
    const commentList = document.createElement('ul');
    commentList.classList.add('comments');
    for (let i = 0; i < post.comments.length; i++) {
        const comment = post.comments[i];
        const listItemEl = renderCommentListItem(comment);
        commentList.append(listItemEl);
    }
    article.insertAdjacentElement('beforeend',commentList);
    renderCommentForm(post,article);
}


// create new post================================================
const createNewPost = (title,imgUrl) => {
    fetch('http://localhost:3000/images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "likes": 0,
            "image": imgUrl
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        console.log(state);
    })
}


// listen to create new post=======================================
const listenToNewPost = () => {
    const commentForm = document.querySelector('.comment-form');
    commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = commentForm.querySelector('#title');
        const image = commentForm.querySelector('#image');
        const inputTitle = input.value;
        const imageUrl = image.value;
        state.inputTitle = inputTitle;
        state.inputImage = imageUrl;
        createNewPost(inputTitle, imageUrl);
    })
}


// get image data==================================
const fetchImagesData = () => {
    fetch('http://localhost:3000/images')
    .then(res => res.json())
    .then(data => {
        state.posts = data;
        console.log('first state: ', state);
        renderFn();
    })
}

// render funstions================================
const renderFn = ()  => {
    state.posts.forEach(obj => {
        renderCards(obj);
    });
    listenToLikeButton();
    listenToNewPost();
}

// init app=========================================
const init = () => {
    fetchImagesData();
}

init();