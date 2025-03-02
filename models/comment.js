const mongoose = require('mongoose');
const Post = require('./post');


const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},
{
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;