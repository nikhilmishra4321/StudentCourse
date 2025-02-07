// const nodemailer = require('nodemailer');

// const sendAdminEmail = async (email, subject, content) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: subject,
//         text: content
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${email}`);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// module.exports = sendAdminEmail;

const nodemailer = require('nodemailer');
const sendAdminEmail = async (email, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: `${content}\n\nLogin here: http://localhost:3000/studentlogin`,
        html: `<p>${content.replace(/\n/g, '<br>')}</p>
               <p><strong><a href="http://localhost:3000/studentlogin" target="_blank">Click here to login</a></strong></p>`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
        return { email, status: 'success' };
    } catch (error) {
        console.error(`Unable to send email to ${email}:`, error);
        return { email, status: 'failed', error: error.message };
    }
};
module.exports = sendAdminEmail;
