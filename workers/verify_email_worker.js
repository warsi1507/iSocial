const queue = require('../configs/bull');
const verificationMailer = require('../mailers/email_verification_mailer');

queue.process('verification_emails', async (job, done) => {
    try {
        console.log('Processing verification email job...');
        await verificationMailer.sendVerificationEmail(job.data);
        console.log("Verification email sent successfully!");
        done();
    } catch (error) {
        console.error("Error in verification email worker:", error);
        done(error);
    }
});
