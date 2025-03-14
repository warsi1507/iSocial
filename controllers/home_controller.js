const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) {
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate({
                path: 'user',
                select: 'name avatar' // Include the avatar field
            })
            .populate('likes')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name avatar' // Include the avatar field for comments' users
                },
                options: { sort: { 'createdAt': -1 } }
            });

        let users = await User.find({});
        
        return res.status(200).render('home', {
            title: "iSocial | Home",
            posts: posts,
            all_users: users
        });
    } catch (error) {
        console.log('Error in Loading Posts:', error);
        return res.status(500).send("Internal Server Error");
    }
}