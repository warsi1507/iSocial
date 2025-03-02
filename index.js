const express = require('express');
const expressLayout = require('express-ejs-layouts');
const db = require('./configs/mongoose.js');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const flashMiddleware = require('./configs/flash-middleware.js')

// for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy.js');
const passportJWT = require('./configs/passport-jwt-strategy.js');
const passportGoogle = require('./configs/passport-google-oauth2-strategy.js');

const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use static-pages
app.use(express.static('./assets'));

// make the upload path available for the user
app.use('/uploads', express.static(__dirname + '/uploads'));

// use static files 
app.use(expressLayout);

// extract styles and scripts from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'iSocial',
    // TODO : change it before deployment
    secret: 'blahblahblah',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            client: db.getClient(),
            autoRemove: 'disabled'
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(flashMiddleware.setFlash);

// use express router
app.use('/', require('./routes/index.js'));

app.listen(process.env.PORT, (err)=>{
    if(err){
        console.error(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${process.env.PORT}`);
})