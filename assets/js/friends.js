const FriendActions = {
    init: function(){
        this.bindEvents();
        this.setupModals();
    },
    bindEvents: function(){
        $(document).on('click', '.send-friend-request', (event) => {
            event.preventDefault();
            this.sendFriendRequest(event);
        });

        $(document).on('click', '.accept-friend-request', (event) => {
            event.preventDefault();
            this.acceptFriendRequest(event);
        });

        $(document).on('click', '.reject-friend-request-btn', (event) => {
            event.preventDefault();
            const requestId = $(event.target).data('request-id');
            const userName = $(event.target).data('user-name');
            this.showRejectRequestModal(requestId, userName);
        });

        $(document).on('click', '.unfriend-btn', (event) => {
            event.preventDefault();
            const friendId = $(event.target).closest('.unfriend-btn').data('friend-id');
            const friendName = $(event.target).closest('.unfriend-btn').data('friend-name');
            this.showUnfriendModal(friendId, friendName);
        });

        // Modal buttons
        $('#confirm-unfriend').on('click', () => {
            this.removeFriend();
        });
        $('#cancel-unfriend').on('click', () => {
            this.hideUnfriendModal();
        });
        $('#confirm-reject').on('click', () => {
            this.rejectFriendRequest();
        });
        $('#reject-and-block').on('click', () => {
            this.rejectAndBlockUser();
        });
        $('#cancel-reject').on('click', () => {
            this.hideRejectRequestModal();
        });
    },
    setupModals: function() {
        // Close modals when clicking outside
        $('.fixed').on('click', function(e) {
            if (e.target === this) {
                $(this).removeClass('flex').addClass('hidden');
            }
        });
    },
    showUnfriendModal: function(friendId, friendName) {
        $('#unfriend-user-name').text(friendName);
        $('#unfriend-modal').data('friend-id', friendId);
        $('#unfriend-modal').removeClass('hidden').addClass('flex');
    },
    hideUnfriendModal: function() {
        $('#unfriend-modal').removeClass('flex').addClass('hidden');
    },
    showRejectRequestModal: function(requestId, userName) {
        $('#reject-user-name').text(userName);
        $('#reject-request-modal').data('request-id', requestId);
        $('#reject-request-modal').removeClass('hidden').addClass('flex');
    },
    hideRejectRequestModal: function() {
        $('#reject-request-modal').removeClass('flex').addClass('hidden');
    },
    sendFriendRequest: function(event){
        let self = $(event.currentTarget);
        let recipientId = self.data('id');
        
        $.ajax({
            type: 'POST',
            url: '/friends/send-request',
            data: { id: recipientId },
            success: function(response){
                console.log('Friend request sent:', response);
                self.prop('disabled', true);
                self.removeClass('bg-blue-500 hover:bg-blue-600').addClass('bg-gray-200');
                self.html('<i class="fas fa-clock mr-2"></i> Request Sent');
                
                toastr.success(response.message || 'Friend request sent!');
            },
            error: function(xhr){
                console.error('Error sending friend request:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error sending friend request');
            }
        });
    },
    acceptFriendRequest: function(event) {
        let self = $(event.currentTarget);
        let requestId = self.data('id');
        
        $.ajax({
            type: 'POST',
            url: '/friends/accept-request',
            data: { id: requestId },
            success: function(response){
                console.log('Friend request accepted:', response);
                
                if ($(event.currentTarget).closest('li').length) {
                    // If in request list, remove the item
                    $(event.currentTarget).closest('li').fadeOut(300, function() {
                        $(this).remove();
                    });
                } else {
                    // If on profile page, update the button
                    self.replaceWith(`
                        <button class="unfriend-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 shadow-sm flex items-center"
                                data-friend-id="${response.userId || requestId}"
                                data-friend-name="${response.userName || ''}">
                            <i class="fas fa-user-minus mr-2"></i>
                            Unfriend
                        </button>
                    `);
                }
                
                toastr.success(response.message || 'Friend request accepted!');
                
                // Refresh friends list if present
                if (typeof updateFriendsList === 'function') {
                    updateFriendsList();
                }
            },
            error: function(xhr){
                console.error('Error accepting friend request:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error accepting friend request');
            }
        });
    },
    rejectFriendRequest: function() {
        const requestId = $('#reject-request-modal').data('request-id');
        
        $.ajax({
            type: 'POST',
            url: '/friends/reject-request',
            data: { id: requestId },
            success: function(response){
                console.log('Friend request rejected:', response);
                
                $(`#friend-request-${requestId}`).fadeOut(300, function() {
                    $(this).remove();
                });
                
                toastr.success(response.message || 'Friend request rejected');
                FriendActions.hideRejectRequestModal();
            },
            error: function(xhr){
                console.error('Error rejecting friend request:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error rejecting friend request');
                FriendActions.hideRejectRequestModal();
            }
        });
    },
    rejectAndBlockUser: function() {
        const requestId = $('#reject-request-modal').data('request-id');
        
        $.ajax({
            type: 'POST',
            url: '/friends/reject-and-block',
            data: { id: requestId },
            success: function(response){
                console.log('Friend request rejected and user blocked:', response);
                
                $(`#friend-request-${requestId}`).fadeOut(300, function() {
                    $(this).remove();
                });
                
                toastr.success(response.message || 'Friend request rejected and user blocked');
                FriendActions.hideRejectRequestModal();
            },
            error: function(xhr){
                console.error('Error rejecting and blocking friend request:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error processing your request');
                FriendActions.hideRejectRequestModal();
            }
        });
    },
    removeFriend: function() {
        const friendId = $('#unfriend-modal').data('friend-id');
        
        $.ajax({
            type: 'POST',
            url: '/friends/remove-friend',
            data: { id: friendId },
            success: function(response){
                console.log('Friend removed:', response);
                
                // If in friends list
                if ($(`#friend-${friendId}`).length) {
                    $(`#friend-${friendId}`).fadeOut(300, function() {
                        $(this).remove();
                    });
                }
                
                // If on profile page
                if ($('.unfriend-btn[data-friend-id="' + friendId + '"]').length) {
                    const button = $('.unfriend-btn[data-friend-id="' + friendId + '"]');
                    button.replaceWith(`
                        <button class="send-friend-request bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-sm flex items-center"
                                data-id="${friendId}">
                            <i class="fas fa-user-plus mr-2"></i>
                            Add Friend
                        </button>
                    `);
                }
                
                toastr.success(response.message || 'Friend removed successfully');
                FriendActions.hideUnfriendModal();
            },
            error: function(xhr){
                console.error('Error removing friend:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error removing friend');
                FriendActions.hideUnfriendModal();
            }
        });
    }
};

function updateFriendsList() {
    $.ajax({
        type: 'GET',
        url: '/friends/list',
        success: function(data) {
            $('#user-friends').replaceWith(data);
        }
    });
}

$(function(){
    FriendActions.init();
});
