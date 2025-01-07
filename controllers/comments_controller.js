const Comment = require('../models/comment');
const Post = require('../models/post')

module.exports.create = async function(req, res){
    try {
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            return res.redirect('/')
        }
    } catch (err) {
        console.log('Error in Creating Comment:',err);
        return res.status(500).send('Internal Server Error')
    }
}