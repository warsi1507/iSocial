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

        $.ajax({
            type: 'POST',
            url: '/posts/create',
            data: newPostForm.serialize(),
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
            <li id="post-${post._id}">
                <p>
                    <small>
                        <a href="/posts/destroy/${post._id}" class="delete-post-button"> X </a>
                    </small>

                    <small>${post.user.name}</small>
                    <br><br>
                    <small>
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                            0 Likes
                        </a>
                    </small>
                    ${post.content}
                </p>

                <div class="post-comments">
                    <form action="/comments/create" method="post" class="new-comment-form">
                        <input type="text" name="content" placeholder="Type here to add comments..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>

                    <div class="post-comments-list">
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
