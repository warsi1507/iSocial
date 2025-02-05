const { json } = require('express');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.status(200).json({
                message:"Invalid username or password",
            });
        }

        return res.status(200).json({
            message:"Sign in Successful, Here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), 'isocial', {expiresIn: '1h'})
            }
        })
    } catch (err) {
        console.log(`Error in Creating JWT Session ${err}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}