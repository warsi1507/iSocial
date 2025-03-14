const mongoose = require('mongoose')
const Comment = require('./comment');

const { postUpload } = require('../configs/upload');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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
    ],
    image: {
        type: String,
        default: null
    }
},{
    timestamps: true
})

postSchema.pre('remove', async function(next) {
    try {
        await Comment.deleteMany({ post: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

postSchema.statics.uploadImage = postUpload;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;