const nodemailer = require('../configs/node-mailer');
require('dotenv').config();

exports.resetPassword = async (user) => {
    try {
        const resetUrl = `${process.env.BACKEND_URL}/users/reset-password/${user.accessToken}`;
        
        const emailHTML = await nodemailer.renderTemplate({user:user, resetUrl: resetUrl}, 'user/password_reset.ejs');
        let info = await nodemailer.transporter.sendMail(
            {
                from: 'iSocial',
                to: user.email,
                subject: "Reset Your Password",
                html: emailHTML
            }
        )
    } catch (err) {
        console.error('Error in sending mail:', err);
    }
}