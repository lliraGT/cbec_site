import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { to, subject, text, html } = req.body;

      const transporter = nodemailer.createTransport({
        // Add your email service configuration here
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'your-email@example.com',
          pass: 'your-password'
        }
      });

      await transporter.sendMail({
        from: 'your-email@example.com',
        to,
        subject,
        text,
        html
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}