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

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment: await comment.populate('user','name'),
                        post_id: comment.post
                    },
                    message: "Comment was Added"
                })
            }
            req.flash('success', 'Comment was Added');
            return res.redirect('/')
        }
    } catch (err) {
        console.log('Error in Creating Comment:',err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
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
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: reqComment.id
                    },
                    message:"Comment Deleted"
                })
            }

            req.flash('success', 'Comment Deleted');
            return res.redirect(req.get('Referer') || '/');
        }
        else{
            req.flash('error', 'You are not allowed to delete this post !!');
            return res.redirect('/');
        }
    } catch (err) {
        console.error("Error in comment deletion:", err);
        return res.status(500).send("Internal Server Error");
    }
}