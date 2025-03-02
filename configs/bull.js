const Bull = require('bull');
require('dotenv').config();

const queue = new Bull('JobsQ',{
    redis: { host: '127.0.0.1', port: process.env.BULL_PORT }
});

module.exports = queue;