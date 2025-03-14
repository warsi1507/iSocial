const nodemailer = require('../configs/node-mailer');

exports.newComment = async (comment) => {
    if(!comment.user || !comment.user.email){
        console.error('User email not found');
        return;
    }

    try {
        const emailHTML = await nodemailer.renderTemplate({ comment }, 'comments/new_comment.ejs');
        let info = await nodemailer.transporter.sendMail(
            {
                from: 'iSocial',
                to: comment.user.email,
                subject: "New Comment Published!",
                html: emailHTML
            }
        )
    } catch (err) {
        console.error('Error in sending mail:', err);
    }
}