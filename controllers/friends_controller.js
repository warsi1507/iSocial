const User = require('../models/user');
const Friendship = require('../models/friendship');
module.exports.sendRequest = async function(req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let recipient = await User.findById(req.body.id);
        let sender = await User.findById(req.user._id);
        if (!recipient || !sender) {
            return res.status(400).json({
                message: 'User not found',
                recipient: recipient?._id,
                sender: sender?._id
            });
        }

        let existingRequest = await Friendship.findOne({from_user: sender._id, to_user: recipient._id});
        if (existingRequest) return res.status(400).json({ message: 'Request Already Sent' });

        if (recipient.blockedUsers.includes(sender._id)) {
            req.flash('error', 'You have been blocked by this User');
            return res.status(400).json({ 
                message: 'Sender is blocked by this user',
                blocked: true,
            });
        }

        let newRequest = await Friendship.create({ from_user: sender._id, to_user: recipient._id });
        req.flash('success', 'Friend request sent');
        return res.status(200).json({ message: 'Friend request sent' });

    } catch (err) {
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: err.message 
        });
    }
};

module.exports.acceptRequest = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let sender = await User.findById(req.body.id);
        let recipient = await User.findById(req.user._id);
        if (!sender || !recipient) {
            return res.status(400).json({
            message: 'User not found',
            sender: sender?._id,
            recipient: recipient?._id
            });
        }

        let friendship = await Friendship.findOne({ from_user: sender._id, to_user: recipient._id });
        if (!friendship) return res.status(400).json({ message: 'Request not found' });
        console.log("herr");

        sender.friends.push(recipient._id);
        recipient.friends.push(sender._id);
        await sender.save();
        await recipient.save();

        await Friendship.deleteOne({ _id: friendship._id });
        req.flash('success', 'Friend request accepted');
        return res.status(200).json({
            message: 'Friend request accepted'
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports.rejectRequest = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let sender = await User.findById(req.body.id);
        let recipient = await User.findById(req.user._id);

        let friendship = await Friendship.findOne({ from_user: sender._id, to_user: recipient._id });
        if (!friendship) return res.status(400).json({ message: 'Request not found' });

        await Friendship.deleteOne({ _id: friendship._id });
        req.flash('success', 'Friend request rejected');
        return res.status(200).json({ message: 'Friend request rejected' });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports.rejectAndBlockRequest = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let sender = await User.findById(req.body.id);
        let recipient = await User.findById(req.user._id);

        let friendship = await Friendship.findOne({ from_user: sender._id, to_user: recipient._id });
        if (!friendship) return res.status(400).json({ message: 'Request not found' });

        await Friendship.deleteOne({ _id: friendship._id });
        recipient.blockedUsers.push(sender._id);
        await recipient.save();

        req.flash('success', 'Friend request rejected and user blocked');
        return res.status(200).json({ message: 'Friend request rejected and user blocked' });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports.removeFriends = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let friendToRemove = await User.findById(req.body.id);
        let currentUser = await User.findById(req.user._id);

        if (!friendToRemove || !currentUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        currentUser.friends = currentUser.friends.filter(friendId => friendId.toString() !== friendToRemove._id.toString());
        friendToRemove.friends = friendToRemove.friends.filter(friendId => friendId.toString() !== currentUser._id.toString());

        await currentUser.save();
        await friendToRemove.save();

        req.flash('success', 'Friend removed successfully');
        return res.status(200).json({ message: 'Friend removed successfully' });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
