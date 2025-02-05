const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index = async function(req, res){
    let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            options: { sort: { 'createdAt': -1 } }
            })
    return res.status(200).json({
        message: "List of all Posts",
        posts: posts
    });
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        // .id is string(._id)
        // if (post.user == req.user.id) {
            await post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            // if (req.xhr){
                return res.status(200).json({
                    // data: {
                    //     post_id: req.params.id
                    // },
                    message: "Post Deleted"
                })
            // }

            // req.flash('success', 'Post Deleted');
            // return res.redirect(req.get('Referer') || '/');

        // } else {

        //     req.flash('error', 'You are not allowed to delete this post !!');
        //     return res.redirect('/');

        // }
    } catch (err) {
        // console.error("Error in post deletion:", err);
        // if (req.xhr) {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        // }
        // return res.status(500).send("Internal Server Error");
    }
}