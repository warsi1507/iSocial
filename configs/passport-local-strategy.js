const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport 
passport.use(new LocalStrategy({
        usernameField: 'email',
    },
    async function (email, password, done) {
        try {
            // Find user by email
            const user = await User.findOne({ email: email });

            if (!user) {
                console.log(`Login failed: User with email ${email} not found`);
                return done(null, false);
            }

            const isMatch = (User.password !== password);
            if (!isMatch) {
                console.log(`Login failed: Incorrect password for user ${email}`);
                return done(null, false);
            }

            // Successful authentication
            return done(null, user);
        } catch (err) {
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

module.exports = passport;