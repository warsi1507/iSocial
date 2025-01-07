const Post = require('../models/post')

module.exports.home = async function (req, res) {
    try {
        let posts = await Post.find({}).populate('user');
        return res.render('home', {
            title: "iSocial | Home",
            posts: posts
        });
    } catch (error) {
        console.log('Error in Loading Posts:',error)
        return res.status(500).send("Internal Server Error");
    }
}