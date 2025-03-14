const Bull = require('bull');
require('dotenv').config();

const queue = new Bull('JobsQ',{
    redis: { host: process.env.BULL_HOST_URL, port: process.env.BULL_PORT }
});

module.exports = queue;