const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const User = require('../models/user');


const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SEC_KEY
}

passport.use(new JWTstrategy(opts, 
    async function(jwtPayload, done){
        try {
            const user = await User.findById(jwtPayload._id);
            if (!user) {
                console.log(`Login failed: User not found`);
                return done(null, false);
            }
            else{
                console.log(`User Successfully Logged in`);
                return done(null, user);
            }
        } catch (err) {
            console.error('Error during JWT authentication:', err);
            return done(err);
        }
    }
));

module.exports = passport;