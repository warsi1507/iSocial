
const UserBlockActions = {
    init: function(){
        this.bindEvents();
    },
    bindEvents: function(){
        $(document).on('click', '.block-user', (event)=>{
            event.preventDefault();
            this.blockUser(event);
        });
        $(document).on('click', '.unblock-user', (event) => {
            event.preventDefault();
            this.unblockUser(event);
        });
    },
    blockUser: function(event){
        let self = $(event.currentTarget);
        let userId = self.data('id');
        $.ajax({
            type: 'POST',
            url: '/users/block-user',
            data: { id: userId },
            success: function(response){
                console.log('User blocked successfully:', response);
                self.text('Blocked');
                window.location.reload();
            },
            error: function(xhr){
                console.error('Error blocking user:', xhr.responseText);
            }
        });
    },
    unblockUser: function(event){
        console.log("HERE...");

        let self = $(event.currentTarget);
        let userId = self.data('id');
        $.ajax({
            type: 'POST',
            url: '/users/unblock-user',
            data: { id: userId },
            success: function(response){
                console.log('User unblocked successfully:', response);
                self.text('Unblocked');
                window.location.reload();
            },
            error: function(xhr){
                console.error('Error unblocking user:', xhr.responseText);
            }
        });
    }
};

$(function(){
    UserBlockActions.init();
})