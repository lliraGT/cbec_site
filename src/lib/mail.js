import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Add your email service configuration here
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});

export const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: 'your-email@example.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};