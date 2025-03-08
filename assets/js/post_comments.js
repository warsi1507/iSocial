const CommentHandler = {
    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document)
            .on('submit', 'form[id^="new-comment-form-"]', this.createComment)
            .on('click', '.delete-comment-button', this.deleteComment);
    },

    createComment: function(event) {
        event.preventDefault();

        let newCommentForm = $(this);

        $.ajax({
            type: 'POST',
            url: '/comments/create',
            data: newCommentForm.serialize(),
            success: function(response) {
                let newComment = CommentHandler.generateCommentHTML(response.data.comment);
                $(`#post-comments-${response.data.post_id}`).prepend(newComment);
                newCommentForm[0].reset();
                toastr['success'](response.message || 'Comment added successfully.');
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                toastr['error']('An error occurred while adding the comment.');
            }
        });
    },

    deleteComment: function(event) {
        event.preventDefault();

        let deleteButton = $(this);
        let url = deleteButton.attr('href');

        $.ajax({
            type: 'GET',
            url: url,
            success: function(response) {
                $(`#comment-${response.data.comment_id}`).remove();
                toastr['success'](response.message || 'Comment deleted successfully.');
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                toastr['error']('An error occurred while deleting the comment.');
            }
        });
    },

    generateCommentHTML: function(comment) {
        return `
            <li id="comment-${comment._id}" class="bg-white rounded-lg shadow-sm p-3 mb-3 transition-all duration-300 hover:shadow-md">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    ${comment.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p class="font-medium text-gray-700">${comment.user.name}</p>
                    <p class="mt-1 text-gray-600">${comment.content}</p>
                </div>
                </div>
                
                <a href="/comments/destroy/${comment._id}" class="delete-comment-button text-gray-400 hover:text-red-500 transition-colors duration-300">
                <i class="fas fa-trash-alt"></i>
                </a>
            </div>
            
            <div class="mt-3 flex items-center text-sm text-gray-500">
                <div class="flex items-center">
                <a class="toggle-like-button flex items-center text-gray-500 transition-colors duration-300" 
                   data-likes="${comment.likes.length}" 
                   href="/likes/toggle/?id=${comment._id}&type=Comment">
                    ${comment.likes.some(like => like.user.toString() === locals.user.id.toString()) ? 
                    '<i class="fa-solid fa-heart mr-1 text-red-500"></i>' : 
                    '<i class="fa-regular fa-heart mr-1 hover:text-red-500"></i>'}
                    <span>${comment.likes.length}</span>
                </a>
                </div>
                
                <span class="text-xs text-gray-400 ml-3">
                ${(() => {
                    const now = new Date();
                    const createdAt = new Date(comment.createdAt);
                    const diffInSeconds = Math.floor((now - createdAt) / 1000);
                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    const diffInHours = Math.floor(diffInMinutes / 60);
                    const diffInDays = Math.floor(diffInHours / 24);

                    if (diffInSeconds < 60) {
                    return `${diffInSeconds} seconds ago`;
                    } else if (diffInMinutes < 60) {
                    return `${diffInMinutes} minutes ago`;
                    } else if (diffInHours < 24) {
                    return `${diffInHours} hours ago`;
                    } else if (diffInDays === 1) {
                    return `Yesterday`;
                    } else {
                    return `${createdAt.getDate()} ${createdAt.toLocaleString('default', { month: 'long' })} ${createdAt.getFullYear()}`;
                    }
                })()}
                </span>
            </div>
            </li>
        `;
    }
};

// Shorthand for document ready
$(function() {
    CommentHandler.init();
});
