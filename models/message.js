const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        roomId: String,
        sender: String,
        receiver: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
    },
    { collection: "messages" }
);

module.exports = mongoose.model("Message", messageSchema);
