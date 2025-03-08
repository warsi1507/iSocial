const UserBlockActions = {
    init: function(){
        this.bindEvents();
        this.setupModals();
    },
    bindEvents: function(){
        $(document).on('click', '.block-user', (event) => {
            event.preventDefault();
            const userId = $(event.currentTarget).data('id');
            const userName = $(event.currentTarget).data('name');
            this.showBlockUserModal(userId, userName);
        });
        
        $(document).on('click', '.unblock-user', (event) => {
            event.preventDefault();
            const userId = $(event.currentTarget).data('id');
            const userName = $(event.currentTarget).data('name');
            this.showUnblockUserModal(userId, userName);
        });
        
        // Modal buttons
        $('#confirm-block').on('click', () => {
            this.blockUser();
        });
        $('#cancel-block').on('click', () => {
            this.hideBlockUserModal();
        });
        $('#confirm-unblock').on('click', () => {
            this.unblockUser();
        });
        $('#cancel-unblock').on('click', () => {
            this.hideUnblockUserModal();
        });
    },
    setupModals: function() {
        // Close modals when clicking outside (if not already set up by FriendActions)
        if (typeof FriendActions === 'undefined' || typeof FriendActions.setupModals === 'undefined') {
            $('.fixed').on('click', function(e) {
                if (e.target === this) {
                    $(this).removeClass('flex').addClass('hidden');
                }
            });
        }
    },
    showBlockUserModal: function(userId, userName) {
        $('#block-user-name').text(userName);
        $('#block-user-modal').data('user-id', userId);
        $('#block-user-modal').removeClass('hidden').addClass('flex');
    },
    hideBlockUserModal: function() {
        $('#block-user-modal').removeClass('flex').addClass('hidden');
    },
    showUnblockUserModal: function(userId, userName) {
        $('#unblock-user-name').text(userName);
        $('#unblock-user-modal').data('user-id', userId);
        $('#unblock-user-modal').removeClass('hidden').addClass('flex');
    },
    hideUnblockUserModal: function() {
        $('#unblock-user-modal').removeClass('flex').addClass('hidden');
    },
    blockUser: function() {
        const userId = $('#block-user-modal').data('user-id');
        
        $.ajax({
            type: 'POST',
            url: '/users/block-user',
            data: { id: userId },
            success: function(response) {
                console.log('User blocked successfully:', response);
                
                // If on profile page
                if ($('.block-user[data-id="' + userId + '"]').length) {
                    const button = $('.block-user[data-id="' + userId + '"]');
                    button.replaceWith(`
                        <button class="unblock-user bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 shadow-sm flex items-center"
                                data-id="${userId}"
                                data-name="${$('#block-user-name').text()}">
                            <i class="fas fa-unlock mr-2"></i>
                            Unblock
                        </button>
                    `);
                    
                    // Also remove friend buttons if present
                    $('.send-friend-request[data-id="' + userId + '"]').remove();
                    $('.unfriend-btn[data-friend-id="' + userId + '"]').remove();
                }
                
                // If in blocked users list, refresh
                if ($('#blocked-users-list').length) {
                    updateBlockedUsersList();
                }
                
                toastr.success(response.message || 'User blocked successfully');
                UserBlockActions.hideBlockUserModal();
            },
            error: function(xhr) {
                console.error('Error blocking user:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error blocking user');
                UserBlockActions.hideBlockUserModal();
            }
        });
    },
    unblockUser: function() {
        const userId = $('#unblock-user-modal').data('user-id');
        
        $.ajax({
            type: 'POST',
            url: '/users/unblock-user',
            data: { id: userId },
            success: function(response) {
                console.log('User unblocked successfully:', response);
                
                // If in blocked users list
                if ($(`#blocked-user-${userId}`).length) {
                    $(`#blocked-user-${userId}`).fadeOut(300, function() {
                        $(this).remove();
                    });
                }
                
                // If on profile page
                if ($('.unblock-user[data-id="' + userId + '"]').length) {
                    const button = $('.unblock-user[data-id="' + userId + '"]');
                    button.replaceWith(`
                        <button class="block-user bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 shadow-sm flex items-center"
                                data-id="${userId}"
                                data-name="${$('#unblock-user-name').text()}">
                            <i class="fas fa-ban mr-2"></i>
                            Block
                        </button>
                    `);
                    
                    // Also add friend button
                    if ($('.profile-actions').length && !$('.send-friend-request').length && !$('.unfriend-btn').length) {
                        $('.profile-actions').prepend(`
                            <button class="send-friend-request bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-sm flex items-center mr-2"
                                    data-id="${userId}">
                                <i class="fas fa-user-plus mr-2"></i>
                                Add Friend
                            </button>
                        `);
                    }
                }
                
                toastr.success(response.message || 'User unblocked successfully');
                UserBlockActions.hideUnblockUserModal();
            },
            error: function(xhr) {
                console.error('Error unblocking user:', xhr.responseText);
                toastr.error(xhr.responseJSON?.message || 'Error unblocking user');
                UserBlockActions.hideUnblockUserModal();
            }
        });
    }
};

function updateBlockedUsersList() {
    $.ajax({
        type: 'GET',
        url: '/users/blocked',
        success: function(data) {
            $('#blocked-users-list').html(data);
        }
    });
}

$(function(){
    UserBlockActions.init();
});