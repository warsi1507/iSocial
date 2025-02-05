const express = require('express');
const postApi = require('../../../controllers/api/v2/posts_api')

const router = express.Router();

router.get('/',postApi.index)

module.exports = router