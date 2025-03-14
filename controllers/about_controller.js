const Users = require('../models/user');

module.exports.aboutPage = async function (req, res) {
    try {
        return res.render('about', {
            title: 'About',
        });
    } catch (err) {
        console.error("Error loading chat page:", err);
        return res.status(500).send("Internal Server Error");
    }
}
