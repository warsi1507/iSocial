const Users = require('../models/user');

module.exports.chatPage = async function (req, res) {
    try {
        const currentUser = await Users.findById(req.user._id).populate('friends').exec();

        return res.render('chats', {
            title: 'Chats',
            friends: currentUser.friends
        });
    } catch (err) {
        console.error("Error loading chat page:", err);
        return res.status(500).send("Internal Server Error");
    }
}
