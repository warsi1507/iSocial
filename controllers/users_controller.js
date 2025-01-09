const User = require('../models/user')

module.exports.profile = async function (req, res) {
    let user = await User.findById(req.params.id);
    return res.render('profile', {
        title: "Profile",
        profile_user: user
    });
}

module.exports.update = async function(req, res){
    try {
        if(req.user.id == req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body)
            return res.redirect(req.get('Referer') || '/');
        }
        else{
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error("Error in user profile updating:", err);
        return res.status(500).send("Internal Server Error");
    }
}

// render the sign-up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'iSocial | Sign Up'
    })
}

// render the sign-in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
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
            return res.redirect(req.get('Referer') || '/');
        }

        // Check if the user already exists
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            console.log("User already exists.");
            return res.redirect(req.get('Referer') || '/');
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

// Sign out 
module.exports.destroySession = function (req, res){
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/error'); // Handle error if needed
        }
        return res.redirect('/'); // Redirect after successful logout
    });
}