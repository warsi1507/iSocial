const Comment = require('../models/comment');
const Post = require('../models/post');
const queue = require('../configs/bull');
const commentEmailWorker = require('../workers/comment_email_worker');

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
            await post.save();
            
            comment = await comment.populate('user', 'name email');
            
            // adding job of sending email to redis Queue (Jobs_Q)
            await queue.add('emails', comment, {
                attempts: 3,
                backoff: 5000
            }).then((job) => {
                console.log(`✅ Job added: ID = ${job.id}, Data =`, job.data);
            }).catch((err) => {
                console.error("🚨 Error adding job to queue:", err);
            });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment: comment,
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
        req.flash('error', 'Could not add comment. Try again.');
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