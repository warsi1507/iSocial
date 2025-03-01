const queue = require('../configs/bull');
const commentsMailer = require('../mailers/comments_mailer');

queue.process('comment_emails', async (job, done) => {
    try {
        console.log(`Processing email for new comment`);
        await commentsMailer.newComment(job.data);
        console.log("Email sent!");
        done();
    } catch (error) {
        console.error("Email failed:", error);
        done(error);
    }
});
