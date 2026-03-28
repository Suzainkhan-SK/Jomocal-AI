const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

// Verify transporter connection on startup
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ Nodemailer Connection Error: Make sure EMAIL_USER and EMAIL_APP_PASSWORD are correct.', error);
    } else {
        console.log('✅ Nodemailer is running and ready to send emails.');
    }
});

const sendEmail = async ({ to, subject, html }) => {
    console.log(`⏳ Attempting to send email to ${to}...`);
    try {
        const mailOptions = {
            from: `"Jomocal AI" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}! (Message ID: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`❌ Email sending failed for ${to}:`, error);
        return false;
    }
};

module.exports = sendEmail;
