const PostHandler = {
    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document)
            .on('submit', '#new-post-form', this.createPost)
            .on('click', '.delete-post-button', this.deletePost);
    },

    createPost: function(event) {
        event.preventDefault();

        let newPostForm = $(this);
        let formData = new FormData(newPostForm[0]);
        $.ajax({
            type: 'POST',
            url: '/posts/create',
            data: formData,
            contentType: false, // prevent jQuery from overriding the content type
            processData: false, // prevent jQuery from processing the data
            success: function(response) {
                let newPost = PostHandler.generatePostHTML(response.data.post);
                $('#posts-list-container > ul').prepend(newPost);
                newPostForm[0].reset();
                toastr['success'](response.message || 'Post created successfully.');
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                toastr['error']('An error occurred while creating the post.');
            }
        });
    },

    deletePost: function(event) {
        event.preventDefault();

        let deleteButton = $(this);
        let url = deleteButton.attr('href');

        $.ajax({
            type: 'GET',
            url: url,
            success: function(response) {
                $(`#post-${response.data.post_id}`).remove();
                toastr['success'](response.message || 'Post deleted successfully.');
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                toastr['error']('An error occurred while deleting the post.');
            }
        });
    },

    generatePostHTML: function(post) {
        return $(`
            <li id="post-${post._id}" class="bg-white rounded-lg shadow p-4 mb-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                    ${post.user.avatar ? `<img src="${post.user.avatar}" alt="${post.user.name}" class="w-10 h-10 rounded-full">` : post.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="font-medium text-gray-800">${post.user.name}</h3>
                    <p class="text-xs text-gray-500">Posted just now</p>
                </div>
                </div>
                
                <a href="/posts/destroy/${post._id}" class="delete-post-button text-gray-400 hover:text-red-500 transition-colors duration-300">
                <i class="fas fa-trash-alt"></i>
                </a>
            </div>

            <div class="mt-3 text-gray-700">
                <p>${post.content}</p>
            </div>

            ${post.image ? `
            <div class="mt-3 text-gray-700">
                <img src="${post.image}" alt="post-image" class="w-full h-auto rounded-lg shadow-sm">
            </div>
            ` : ''}

            <div class="mt-4 flex items-center justify-between border-t border-b border-gray-100 py-2">
                <div class="flex items-center space-x-4">
                <a class="toggle-like-button flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-300 px-2 py-1 rounded-md" 
                   data-likes="${post.likes.length}" 
                   href="/likes/toggle/?id=${post._id}&type=Post">
                    <i class="fa-regular fa-heart mr-1 hover:text-red-500"></i>
                    <span>${post.likes.length}</span>
                </a>
                
                <button class="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-300 px-2 py-1 rounded-md comment-toggle">
                    <i class="far fa-comment mr-1"></i>
                    <span>Comments</span>
                </button>
                </div>
                
                <button class="text-gray-500 hover:text-blue-500 transition-colors duration-300 px-2 py-1 rounded-md">
                <i class="fas fa-share-alt"></i>
                </button>
            </div>

            <div class="post-comments mt-4">
                <form action="/comments/create" method="post" class="new-comment-form mb-4 flex">
                <input type="text" name="content" placeholder="Write a comment..." required
                       class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                <input type="hidden" name="post" value="${post._id}">
                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-300">
                    <i class="fas fa-paper-plane"></i>
                </button>
                </form>

                <div id="post-comments-list" class="mt-2">
                <ul id="post-comments-${post._id}"></ul>
                </div>
            </div>
            </li>
        `);
    }
};

// Initialize PostHandler on document ready
$(function() {
    PostHandler.init();
});
