const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const chatSockets = require('./configs/chat_sockets.js').chatSockets;

const expressLayout = require('express-ejs-layouts');
const db = require('./configs/mongoose.js');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const flashMiddleware = require('./configs/flash-middleware.js')

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport-local-strategy.js');
const passportJWT = require('./configs/passport-jwt-strategy.js');
const passportGoogle = require('./configs/passport-google-oauth2-strategy.js');
const cron = require('node-cron');
const User = require('./models/user.js');

const MongoStore = require('connect-mongo');

require('dotenv').config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: process.env.CORS_ORIGIN}})
chatSockets(io);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('./assets'));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayout);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'iSocial',
    secret: process.env.SESSION_SECRET,
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

app.use('/', require('./routes/index.js'));

server.listen(process.env.PORT, (err)=>{
    if(err){
        console.error(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${process.env.PORT}`);
})



cron.schedule('0 */6 * * *', async () => {
    console.log("Running cleanup job for expired unverified users...");
    await deleteExpiredUsers();
});

const deleteExpiredUsers = async () => {
    const now = new Date();
    try {
        const result = await User.deleteMany({
            isVerified: false,
            verificationTokenExpires: { $lt: now }
        });
        console.log(`Deleted ${result.deletedCount} expired unverified users.`);
    } catch (error) {
        console.error("Error deleting expired unverified users:", error);
    }
};