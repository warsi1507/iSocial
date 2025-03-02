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
        return $(`
            <li id="comment-${comment._id}">
                <p>
                    <small>
                        <a href="/comments/destroy/${comment._id}" class="delete-comment-button"> X </a>
                    </small>
                    ${comment.content}
                    <br>
                    <small>${comment.user.name}</small>
                    <br>
                    <small>
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                        </a>
                    </small>
                </p>
            </li>
        `);
    }
};

// Shorthand for document ready
$(function() {
    CommentHandler.init();
});
