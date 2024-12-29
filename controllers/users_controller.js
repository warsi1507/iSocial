module.exports.profile = function (req, res) {
    return res.render('profile', {
        title: "Profile"
    });
}

// render users posts
module.exports.posts = function (req, res) {
    return res.render('posts', {
        title: "Posts"
    });
}

// render the sign-up page
module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: 'iSocial | Sign Up'
    })
}

// render the sign-in page
module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: 'iSocial | Sign In'
    })
}

// get the sign-up data 
module.exports.create = function () {
    // TODO later 
}

// Sign in and create a session
module.exports.createSession = function (req, res) {
    // TODO later
}