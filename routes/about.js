const express = require('express');
const router  = express.Router();
const passport = require('passport');

const aboutController = require('../controllers/about_controller');

router.get('/',aboutController.aboutPage)

module.exports = router;