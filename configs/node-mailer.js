require('dotenv').config();
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
    },
});

let renderTemplate = async function(data, relativePath)
{
    try {
        const templatePath = path.join(__dirname, '../views/mailers', relativePath);
        return await ejs.renderFile(templatePath, data);
    } catch (err) {
        console.error('Error rendering email template:', err);
        return null;
    }
}

module.exports = 
{
    transporter: transporter,
    renderTemplate: renderTemplate
}