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
        if (post.user == req.user.id) {
            await post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });
                return res.status(200).json({
                    message: "Post Deleted"
                })
        } else {

            return res.status(401).json({
                message:"You can't delete this post!!"
            })

        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

/* I will remove it after sometime
    - How This Works in a Full Flow
    - User Logs In → Gets a JWT token.
    - User Sends a DELETE Request → DELETE /posts/:id with JWT in the header.
    - JWT is Validated → Passport.js extracts user info from the token.
    - Check if the Post Belongs to the User:
        ✅ If Yes → Delete the post & comments.
        ❌ If No → Return 401 Unauthorized.
    - Response is Sent to the Client.
*/