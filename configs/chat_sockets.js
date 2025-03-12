const Message = require("../models/message");

let onlineUsers = {};

module.exports.chatSockets = function(io) {
  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);
    
    socket.on("user_online", (data) => {
      console.log("User online:", data.userId);
      onlineUsers[data.userId] = socket.id;
      io.emit("update_online_status", onlineUsers);
    });
    
    socket.on("join_room", async (data) => {
      socket.join(data.roomId);
      console.log(`${data.userName} joined room ${data.roomId}`);
      try {
        const messages = await Message.find({ roomId: data.roomId })
          .sort({ timestamp: 1 })
          .limit(100);
        socket.emit("load_previous_messages", messages);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    });
    
    socket.on("send_message", async (data) => {
      console.log("Send message:", {
        from: data.userName,
        to: data.receiverName,
        roomId: data.roomId
      });
      
      const newMessage = new Message({
        roomId: data.roomId,
        sender: data.userName,
        receiver: data.receiverName,
        message: data.message,
        timestamp: Date.now()
      });
      
      try {
        await newMessage.save();
        io.to(data.roomId).emit("receive_message", {
          roomId: data.roomId,
          userName: data.userName,
          message: data.message,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });
    
    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomId).emit("user_typing", data);
    });
    
    socket.on("disconnect", () => {
      for (let id in onlineUsers) {
        if (onlineUsers[id] === socket.id) {
          console.log("User disconnected:", id);
          delete onlineUsers[id];
          io.emit("update_online_status", onlineUsers);
          break;
        }
      }
    });
  });
};