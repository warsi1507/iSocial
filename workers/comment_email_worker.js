const queue = require('../configs/bull');
const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', async (job, done) => {
    try {
        console.log(`Processing email for comment ID: ${job.data.id}`);
        await commentsMailer.newComment(job.data);
        console.log("Email sent!");
        done();
    } catch (error) {
        console.error("Email failed:", error);
        done(error);
    }
});
