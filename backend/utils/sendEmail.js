const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  try {
    
    const isConfigured = 
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS;

    if (!isConfigured) {
      logger.warn(`Email configuration missing. Simulating sending email to [${options.email}]`);
      logger.info(`Subject: ${options.subject}`);
      logger.info(`Message: ${options.message}`);
      return { message: 'Email simulated successfully', success: true };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'PeerRental'} <${process.env.FROM_EMAIL || 'noreply@peerrental.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { info, success: true };
  } catch (error) {
    logger.error('Failed to send email:', error);
    
    return { error, success: false, simulated: true };
  }
};

module.exports = sendEmail;
