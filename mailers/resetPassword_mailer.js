const nodemailer = require('../configs/node-mailer');

exports.resetPassword = async (user) => {
    try {
        
        const emailHTML = await nodemailer.renderTemplate({user:user }, 'user/password_reset.ejs');
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