const queue = require('../configs/bull');
const resetPasswordMailer = require('../mailers/resetPassword_mailer');

queue.process('user_rePass_emails', async (job, done) => {
    try {
        console.log(`Processing email for password reset`);
        await resetPasswordMailer.resetPassword(job.data);
        console.log("Email sent!");
        done();
    } catch (error) {
        console.error("Email failed:", error);
        done(error);
    }
});
