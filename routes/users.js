const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller.js');

router.get('/', function(req, res){return res.redirect('/users/profile')})
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
// router.get('/posts',usersController.posts);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

// use passport as middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession)

router.get('/sign-out', usersController.destroySession);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect:'/users/sign-in'}),
    usersController.createSession
);


router.get('/reset-password', usersController.resetPassword);
router.post('/send-reset-pass-mail', usersController.resetPassMail);

router.get('/reset-password/:accessToken', usersController.setPassword);
router.post('/update-password/:accessToken', usersController.updatePassword);

router.post('/block-user', usersController.blockUser);
router.post('/unblock-user', usersController.unblockUser);

router.get('/requests', usersController.friendRequests);
router.get('/verify-email/:token', usersController.verifyEmail);
module.exports = router;