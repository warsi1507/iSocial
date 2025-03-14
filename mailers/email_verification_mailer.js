const nodemailer = require('../configs/node-mailer');
require('dotenv').config();

exports.sendVerificationEmail = async (user) => {

    if (!user.email) {
        console.error('User email not found');
        return;
    }

    try {
        const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email/${user.verificationToken}`;
        
        const emailHTML = await nodemailer.renderTemplate({ user, verificationUrl }, '/user/email_verification.ejs');
        
        let info = await nodemailer.transporter.sendMail({
            from: 'iSocial',
            to: user.email,
            subject: "Email Verification - iSocial",
            html: emailHTML
        });
    } catch (err) {
        console.error('Error in sending verification email:', err);
    }
};
