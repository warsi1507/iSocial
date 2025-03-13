const nodemailer = require('../configs/node-mailer');
require('dotenv').config();

exports.sendVerificationEmail = async (user) => {
    console.log('Sending verification email...');

    if (!user.email) {
        console.error('User email not found');
        return;
    }

    try {
        // Construct the verification URL using the verification token.
        const verificationUrl = `http://localhost:8000/users/verify-email/${user.verificationToken}`;
        
        // Render the email template (placed under views/mailers/verification/verify_email.ejs)
        const emailHTML = await nodemailer.renderTemplate({ user, verificationUrl }, '/user/email_verification.ejs');
        
        // Send the email using the configured transporter.
        let info = await nodemailer.transporter.sendMail({
            from: 'iSocial',
            to: user.email,
            subject: "Email Verification - iSocial",
            html: emailHTML
        });
        
        console.log("Verification email sent!", info);
    } catch (err) {
        console.error('Error in sending verification email:', err);
    }
};
