const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport 
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    async function (req, email, password, done) {
        try {
            // Find user by email
            const user = await User.findOne({ email: email });

            if (!user) {
                req.flash('error', 'Invalid Username or Password');
                console.log(`Login failed: User with email ${email} not found`);
                return done(null, false);
            }

            const isMatch = (user.password == password);
            if (!isMatch) {
                req.flash('error', 'Invalid Username or Password');
                console.log(`Login failed: Incorrect password for user ${email}`);
                return done(null, false);
            }

            // Successful authentication
            return done(null, user);
        } catch (err) {
            req.flash('error', err);
            console.error('Error during authentication:', err);
            return done(err);
        }
    }
))

// serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies 
passport.deserializeUser(async function(id, done){
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.error('Error in Deserialization: ', err);
        return done(err);
    }
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed-in, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed-in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;