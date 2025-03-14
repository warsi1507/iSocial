const Bull = require('bull');
require('dotenv').config();

const queue = new Bull('JobsQ', {
  redis: {
    host: process.env.BULL_HOST_URL,
    port: Number(process.env.BULL_PORT),
    password: process.env.BULL_PASSWORD,
    tls: {},
    maxRetriesPerRequest: 3
  }
});

module.exports = queue;
