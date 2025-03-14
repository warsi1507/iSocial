const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    async function (req, email, password, done) {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                req.flash('error', 'Invalid Username or Password');
                console.log(`Login failed: User with email ${email} not found`);
                return done(null, false);
            }

            if (!user.isVerified) {
                req.flash('error', 'Please verify your email before logging in.');
                return done(null, false);
            }

            const isMatch = await bcrypt.compare(password, user.password);;
            if (!isMatch) {
                req.flash('error', 'Invalid Username or Password');
                console.log(`Login failed: Incorrect password for user ${email}`);
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            req.flash('error', err);
            console.error('Error during authentication:', err);
            return done(err);
        }
    }
))

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.error('Error in Deserialization: ', err);
        return done(err);
    }
});

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;