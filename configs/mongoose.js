require('dotenv').config();
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in connecting to MongoDB"))

db.once('open', function () {
   console.log('Connected to Database :: MongoDB');
});

module.exports = db;