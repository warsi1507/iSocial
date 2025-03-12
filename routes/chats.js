const express = require('express');
const router  = express.Router();
const passport = require('passport');

const chatController = require('../controllers/chat_controller');

router.get('/', passport.checkAuthentication, chatController.chatPage)

module.exports = router;