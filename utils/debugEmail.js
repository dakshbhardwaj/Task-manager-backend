require('dotenv').config();
const nodemailer = require('nodemailer');

async function testConnection() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log('SMTP connection successful');
        console.log('Email user:', process.env.EMAIL_USER);
    } catch (error) {
        console.error('SMTP connection failed:', error);
    }
}

testConnection();