const ToggleLike = {
    init: function(){
        this.bindEvents();
    },
    bindEvents: function() {
        $(document).on('click', '.toggle-like-button', (event) => {
            this.toggleLike(event);
        });
    },
    toggleLike: function(event){
        event.preventDefault();
        let self = $(event.currentTarget);

        $.ajax({
            type: 'POST',
            url: self.attr('href'),
            success: function(data){
                let likesCount = parseInt(self.attr('data-likes')) || 0;
                
                if(data.data.deleted){
                    likesCount -= 1;
                } else {
                    likesCount += 1;
                }
                console.log(`Current LikesCount: ${likesCount}`);
                self.attr('data-likes', likesCount);
                self.html(`${likesCount} Likes`);
            },
            error: function(err){
                console.error("Error in liking:", err);
            }
        });
    }
};

$(function() {
    ToggleLike.init();
});
