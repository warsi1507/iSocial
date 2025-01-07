const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller.js');

router.get('/', function(req, res){return res.redirect('/users/profile')})
router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/posts',usersController.posts);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

// use passport as middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession)

router.get('/sign-out', usersController.destroySession)
module.exports = router;