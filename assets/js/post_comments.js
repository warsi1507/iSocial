const createComment = function(){
    $('form[id^="new-comment-form-"]').on('submit', function(event){
        event.preventDefault();

        let newCommentForm = $(this);

        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: newCommentForm.serialize(),

            success: function(data){
                let newComment = newCommentDOM(data.data.comment);
                $(`#post-comments-${data.data.post_id}`).prepend(newComment);
                toastr['success'](data.message);
            },

            error: function(error){
                console.error(error.responseText);
            }
        });
    });

    const newCommentDOM = function(comment){
        return $(`
                <li id="comment-${comment._id}">
                    <p>
                        <small>
                            <a href="/comments/destroy/${comment._id}" class="delete-comment-button"> X </a>
                        </small>

                        ${comment.content}
                        <br>
                        <small>
                            ${comment.user.name}
                        </small>
                    </p>
                </li>
            `)
    }
}

const deleteComment = function(){
    let ls = $('#post-comments-list');

    $('#post-comments-list').on('click', '.delete-comment-button', function(event) {
        event.preventDefault();

        $.ajax({
            type: 'get',
            url: $(this).prop('href'),
            
            success: function(data){
                $(`#comment-${data.data.comment_id}`).remove()
                toastr['success'](data.message);
            },
            error: function(error){
                console.error(error.responseText);
            }
        });
    });
}

createComment();
deleteComment();