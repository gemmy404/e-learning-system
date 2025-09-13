import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import fs from 'fs/promises'

let cachedTemplate: HandlebarsTemplateDelegate | null = null;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const htmlTemplate = async (name: string, code: string) => {
    if (!cachedTemplate) {
        const templateSource = await fs.readFile('./templates/reset-password.html', 'utf8');
        cachedTemplate = Handlebars.compile(templateSource);
    }
    return cachedTemplate({name, resetCode: code});
};

export const emailSender = async (recipient: string, name: string, code: string) => {
    const html = await htmlTemplate(name, code);

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: recipient,
        subject: 'Password Reset Request',
        html
    };

    return await transporter.sendMail(mailOptions);
};