const Like = require('../models/like');
const User = require('../models/user');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res) {
    try {
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if(existingLike) {
            likeable.likes.pull(existingLike._id);
            await likeable.save();

            await existingLike.deleteOne();
            deleted = true;
        } else {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            await likeable.save();
        }

        if(req.xhr){
            return res.status(200).json({
                message: 'Request Successful',
                data: {
                    deleted: deleted
                }
            });
        }
        
        return res.status(200).redirect(req.get('Referer') || '/');

    } catch (err) {
        console.log('Error in Likes:', err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
        return res.status(500).send('Internal Server Error')
    }
}
