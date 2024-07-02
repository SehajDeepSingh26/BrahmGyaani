const nodemailer = require("nodemailer");

const mailSender = async(email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = transporter.sendMail({
            from: 'StudyNotion || Project',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = mailSender