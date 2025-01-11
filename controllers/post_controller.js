const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try {
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: await newPost.populate('user', 'name')
                },
                message: "Post was Created"
            });
        }
    
        req.flash('success', 'Post was Created');
        return res.redirect(req.get('Referer') || '/');

    } catch (err) {

        console.error("Error in post creation:", err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        // .id is string(._id)
        if (post.user == req.user.id) {
            await post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                })
            }

            req.flash('success', 'Post Deleted');
            return res.redirect(req.get('Referer') || '/');

        } else {

            req.flash('error', 'You are not allowed to delete this post !!');
            return res.redirect('/');

        }
    } catch (err) {
        console.error("Error in post deletion:", err);
        if (req.xhr) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
        return res.status(500).send("Internal Server Error");
    }
}