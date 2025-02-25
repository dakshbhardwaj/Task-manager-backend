const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Remove debug settings in production
    logger: false,
    debug: false
});

const sendResetCode = async (email, resetCode) => {
    const mailOptions = {
        from: {
            name: 'Task Manager Support', // More professional name
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Your Task Manager Password Reset Code',
        text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 1 hour.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nTask Manager Team`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Password Reset Code</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your Task Manager account. Your verification code is:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <strong style="font-size: 24px; color: #2c3e50;">${resetCode}</strong>
                </div>
                <p>This code will expire in 1 hour.</p>
                <p style="color: #7f8c8d; font-size: 0.9em;">If you didn't request this reset, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #7f8c8d; font-size: 0.8em;">
                    This is an automated message, please don't reply to this email.
                    If you need assistance, please contact support.
                </p>
            </div>
        `,
        headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error;
    }
};

module.exports = { sendResetCode };