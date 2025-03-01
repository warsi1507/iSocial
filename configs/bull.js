const Bull = require('bull');

const queue = new Bull('JobsQ',{
    redis: { host: '127.0.0.1', port: 6379 }
});

module.exports = queue;