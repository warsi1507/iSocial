const User = require('../models/user')

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
module.exports.create = async function (req, res) {
    try {
        // Check if passwords match
        if (req.body.password !== req.body.confirm_password) {
            console.log("Passwords do not match.");
            return res.redirect('Referrer' || '/');
        }

        // Check if the user already exists
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            console.log("User already exists.");
            return res.redirect('Referrer' || '/');
        }

        // Create a new user
        let newUser = await User.create(req.body);
        console.log("***** User Account Created *****");
        console.log(newUser);

        // Redirect to sign-in page
        return res.redirect('/users/sign-in');
    } catch (err) {
        // Handle errors
        console.error("Error in user creation:", err);
        return res.status(500).send("Internal Server Error");
    }
};


// Sign in and create a session
module.exports.createSession = function (req, res) {
    return res.redirect('/');
}