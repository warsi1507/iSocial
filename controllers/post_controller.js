const Post = require('../models/post')

module.exports.create = async function(req, res){
    try {
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        })
    
        console.log("*** NEW POST CREATED ***");
        
        return res.redirect(req.get('Referer') || '/');
    } catch (err) {
        console.error("Error in user creation:", err);
        return res.status(500).send("Internal Server Error");
    }
}