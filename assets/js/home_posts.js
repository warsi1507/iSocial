const createPost = function(){
    const newPostForm = $('#new-post-form');
    
    newPostForm.submit(function(event){
        event.preventDefault();
        
        $.ajax({
            type: 'post',
            url: '/posts/create',
            data: newPostForm.serialize(), // form data is created to JSON

            success: function(data){
                let newPost = newPostDOM(data.data.post);
                $('#posts-list-container>ul').prepend(newPost);
                toastr['success'](data.message);
            },
            error: function(error){
                console.error(error.responseText);
            }
        });
    });

    // Method to create a post in DOM
    const newPostDOM = function(post){
        
        return $(`
            <li id="post-${post._id}">
                <p>
                    <small>
                        <a href="/posts/destroy/${post._id}" class="delete-post-button"> X </a>
                    </small>

                    <small>
                        ${post.user.name}
                    </small>
                    <br>

                    ${post.content}
                </p>

                <div class="post-comments">
                    <form action="/comments/create" method="post">
                        <input type="text" name="content" placeholder="Type Here to add comments..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>

                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
    
                        </ul>
                    </div>
                </div>
            </li>
        `)
    }

    
}    

// Attach deletePost to all delete buttons using event delegation
const deletePost = function() {
    $('#posts-list-container').on('click', '.delete-post-button', function(event) {
        event.preventDefault();

        $.ajax({
            type: 'get',
            url: $(this).prop('href'),
            
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
                toastr['success'](data.message);
            },
            error: function(error){
                console.error(error.responseText);
            }
        });
    });
}

createPost();
deletePost();