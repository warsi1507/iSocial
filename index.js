const express = require('express');
const expressLayout = require('express-ejs-layouts');
const db = require('./configs/mongoose.js');
const cookieParser = require('cookie-parser');

// for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy.js');

const app = express();
const port = 8000;

// using cookie parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use static-pages
app.use(express.static('./assets'))

// use static files 
app.use(expressLayout)

// extract styles and scripts from sub pages into the layouts
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// 
app.use(session({
    name: 'iSocial',
    // TODO : change it before deployment
    secret: 'blahblahblah',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
// use express router
app.use('/', require('./routes/index.js'));

app.listen(port, (err)=>{
    if(err){
        console.error(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
})