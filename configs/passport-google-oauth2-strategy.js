const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('node:crypto');
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: (process.env.BACKEND_URL || 'http://localhost:8000') + "/users/auth/google/callback"
    },

    async function(accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({email: profile.emails[0].value}).exec();

            if(user){
                return done(null, user);
            }
            else {
                let newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, newUser);
            }
        } catch (err) {
            console.log('Error in Google OAuth strategy:', err);
            return done(err, null);
        }
    }
))

module.exports = passport;