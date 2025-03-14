const socket = io();

let currentFriend = null;
let currentRoom = null;
const userId = document.getElementById("current-user-id").value;

let lastTypingTime = 0;
const TYPING_INTERVAL = 300;
let unreadCounts = {};

document.addEventListener('DOMContentLoaded', function() {
  socket.emit("user_online", { userId });

  document.querySelectorAll('.friend-item').forEach(item => {
    item.addEventListener('click', function() {
      const friendId = this.getAttribute('data-id');
      const friendName = this.getAttribute('data-name');
      
      if (friendId === currentFriend) return;

      currentFriend = friendId;
      document.getElementById('chat-with').innerText = `${friendName}`;
      document.getElementById('chat-panel').classList.remove('hidden');

      document.getElementById("chat-messages").innerHTML = "";

      unreadCounts[friendId] = 0;
      updateUnreadBadge(friendId);
      
      currentRoom = [userId, currentFriend].sort().join("-");
      socket.emit("join_room", { roomId: currentRoom, userName: userId });
    });
  });

  document.getElementById('send-message-btn').addEventListener('click', sendMessage);

  document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  const messageInput = document.getElementById("message-input");
  messageInput.addEventListener("input", function() {
    if (currentRoom) {
      const now = Date.now();
      if (now - lastTypingTime > TYPING_INTERVAL) {
        socket.emit("typing", { roomId: currentRoom, userName: userId });
        lastTypingTime = now;
      }
    }
  });

  socket.on("load_previous_messages", (messages) => {
    messages.forEach((msg) => {
      appendMessage({ message: msg.message, timestamp: msg.timestamp }, msg.sender === userId ? "self" : "other");
    });
  });
  
  socket.on("receive_message", (data) => {
    const isMessageForCurrentChat = data.roomId === currentRoom;
    
    if (data.userName !== userId) {

      if (!isMessageForCurrentChat) {
        const friendItems = document.querySelectorAll('.friend-item');
        friendItems.forEach(item => {
          const friendId = item.getAttribute('data-id');

          const testRoomId = [userId, friendId].sort().join("-");
          
          if (testRoomId === data.roomId) {

            unreadCounts[friendId] = (unreadCounts[friendId] || 0) + 1;
            updateUnreadBadge(friendId);
          }
        });
      }
    }

    if (isMessageForCurrentChat) {
      appendMessage({ message: data.message, timestamp: Date.now() }, data.userName === userId ? "self" : "other");
    }
  });
  
  socket.on("user_typing", (data) => {
    if (data.userName !== userId && data.roomId === currentRoom) {
      showTypingIndicator();
    }
  });
  

  socket.on("update_online_status", (onlineUsers) => {
    document.querySelectorAll('.friend-item').forEach(item => {
      const friendId = item.getAttribute('data-id');
      const indicator = item.querySelector('.online-indicator');
      if (onlineUsers[friendId]) {
        indicator.classList.remove("bg-gray-300");
        indicator.classList.add("bg-green-500");
      } else {
        indicator.classList.remove("bg-green-500");
        indicator.classList.add("bg-gray-300");
      }
    });
  });
});

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();
  if (message && currentRoom) {
    const messageObj = { message: message, timestamp: Date.now() };
    socket.emit("send_message", { roomId: currentRoom, userName: userId, message, receiverName: currentFriend });
    messageInput.value = "";
    hideTypingIndicator();
  }
}

function appendMessage(messageObj, type) {
  const chatMessages = document.getElementById("chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("my-2", "px-4", "py-2", "rounded");
  
  if (type === "self") {
    msgDiv.classList.add("bg-blue-500", "text-white", "ml-auto");
    msgDiv.style.maxWidth = "80%";
  } else {
    msgDiv.classList.add("bg-gray-200", "text-gray-800", "mr-auto");
    msgDiv.style.maxWidth = "80%";
  }
  
  const textDiv = document.createElement("div");
  textDiv.innerText = messageObj.message;
  
  const timeDiv = document.createElement("div");
  timeDiv.classList.add("text-xs", "mt-1", "opacity-75");
  timeDiv.innerText = formatTimestamp(messageObj.timestamp);
  
  msgDiv.appendChild(textDiv);
  msgDiv.appendChild(timeDiv);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTimestamp(timestamp) {
  const dateObj = new Date(timestamp);
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) {
    return `Today, ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeString}`;
  } else {
    return `${dateObj.toLocaleDateString()}, ${timeString}`;
  }
}

let typingTimeout;
function showTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  indicator.classList.remove("hidden");
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => { hideTypingIndicator(); }, 2000);
}

function hideTypingIndicator() {
  document.getElementById("typing-indicator").classList.add("hidden");
}

function updateUnreadBadge(friendId) {
  const friendItem = document.querySelector(`.friend-item[data-id="${friendId}"]`);
  if (friendItem) {
    const badge = friendItem.querySelector('.unread-badge');
    const count = unreadCounts[friendId] || 0;
    if (count > 0) {
      badge.innerText = count;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
}