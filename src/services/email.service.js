const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
        name: process.env.EMAIL_SENDER_NAME,
        email: process.env.EMAIL_SENDER
    };
    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.info('Email sent successfully:', response);
        return response;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
};

module.exports = { sendEmail };