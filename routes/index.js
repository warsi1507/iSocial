const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller.js');
const passport = require('passport');

router.get('/',passport.checkAuthentication, homeController.home);

router.use('/users', require('./users.js'));
router.use('/posts', require('./posts.js'));
router.use('/comments', require('./comments.js'));
router.use('/likes', require('./likes.js'));
router.use('/friends', require('./friends.js'));
router.use('/chats',require('./chats.js'))

router.use('/api', require('./api'))

module.exports = router;