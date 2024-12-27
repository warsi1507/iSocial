const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller.js');
const postsController = require('../controllers/post_controller.js');

router.get('/profile',usersController.profile);
router.get('/posts',postsController.posts);

module.exports = router;