const mongoose = require('mongoose')
const Comment = require('./comment');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // include the array of ids of all comments in this post schema itself
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
})

postSchema.pre('remove', async function(next) {
    try {
        // Delete all comments that reference this post
        await Comment.deleteMany({ post: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;