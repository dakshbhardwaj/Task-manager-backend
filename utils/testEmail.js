const { sendResetCode } = require('./emailService');

async function testEmailService() {
    try {
        await sendResetCode('connectwithdaksh@gmail.com', '123456');
        console.log('Test email sent successfully');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testEmailService();