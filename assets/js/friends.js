const FriendActions = {
    init: function(){
        this.bindEvents();
    },
    bindEvents: function(){
        $(document).on('click', '.send-friend-request', (event)=>{
            event.preventDefault();
            this.sendFriendRequest(event);
        });

        $(document).on('click', '.accept-friend-request', (event) => {
            event.preventDefault();
            this.acceptFriendRequest(event);
        });

        $(document).on('click', '.reject-friend-request', (event) => {
            event.preventDefault();
            this.rejectFriendRequest(event);
        });

        $(document).on('click', '.reject-block-friend-request', (event) => {
            event.preventDefault();
            this.rejectBlockFriendRequest(event);
        });

        $(document).on('click', '.remove-friend', (event) => {
            event.preventDefault();
            this.removeFriend(event);
        });
    },
    sendFriendRequest: function(event){
        let self = $(event.currentTarget);
        let recipientId = self.data('id');
        console.log(recipientId)
        $.ajax({
            type: 'POST',
            url: '/friends/send-request',
            data: { id: recipientId },
            success: function(response){
                console.log('Friend request sent:', response);
                self.text('Request Sent');
            },
            error: function(xhr){
                console.error('Error sending friend request:', xhr.responseText);
            }
        });
    },
    acceptFriendRequest: function (event) {
        let self = $(event.currentTarget);
        let senderId = self.data('id');

        $.ajax({
            type: 'POST',
            url: '/friends/accept-request',
            data: { id: senderId },
            success: function(response){
                console.log('Friend request accepted:', response);
                self.text('Friend Added');
            },
            error: function(xhr){
                console.error('Error accepting friend request:', xhr.responseText);
            }
        });
    },
    rejectFriendRequest: function(event){
        let self = $(event.currentTarget);
        let senderId = self.data('id');
        $.ajax({
            type: 'POST',
            url: '/friends/reject-request',
            data: { id: senderId },
            success: function(response){
                console.log('Friend request rejected:', response);
                self.text('Request Rejected');

                self.siblings('.reject-block-friend-request')
                .text('Request Rejected')
                .prop('disabled', true);
            },
            error: function(xhr){
                console.error('Error rejecting friend request:', xhr.responseText);
            }
        });
    },
    rejectBlockFriendRequest: function(event){
        let self = $(event.currentTarget);
        let senderId = self.data('id');
        $.ajax({
            type: 'POST',
            url: '/friends/reject-and-block',
            data: { id: senderId },
            success: function(response){
                console.log('Friend request rejected and user blocked:', response);
                self.text('User Blocked');
                self.siblings('.reject-friend-request')
                .text('Request Rejected')
                .prop('disabled', true);
            },
            error: function(xhr){
                console.error('Error rejecting and blocking friend request:', xhr.responseText);
            }
        });
    },
    removeFriend: function(event){  
        let self = $(event.currentTarget);
        let friendId = self.data('id');
        $.ajax({
            type: 'POST',
            url: '/friends/remove-friend',
            data: { id: friendId },
            success: function(response){
                console.log('Friend removed:', response);
                self.text('Friend Removed');
            },
            error: function(xhr){
                console.error('Error removing friend:', xhr.responseText);
            }
        });
    }
}

$(function(){
    FriendActions.init();
});