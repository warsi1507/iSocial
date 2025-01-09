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

module.exports.destroy = async function(req, res){
    try {
        let reqComment = await Comment.findById(req.params.id);
        if (reqComment.user == req.user.id) {
            let postID = reqComment.post;

            await reqComment.deleteOne();

            await Post.findByIdAndUpdate(postID, {$pull: {comments: req.params.id}});

            return res.redirect(req.get('Referer') || '/')
        }
        else{
            return res.redirect('/')
        }
    } catch (err) {
        console.error("Error in comment deletion:", err);
        return res.status(500).send("Internal Server Error");
    }
}