const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const salonMailOptions = {
      from: `"Salon Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: `"Salon Shadow White" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Salon Shadow White',
      html: `
        <h3>Thank you for contacting Salon Shadow White</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <p><em>${message}</em></p>
        <br>
        <p>Best regards,</p>
        <p>Salon Shadow White Team</p>
        <p>218 Ranimadama, Wattala</p>
        <p>0768102223</p>
      `,
    };

    // Send emails
    await transporter.sendMail(salonMailOptions);
    await transporter.sendMail(customerMailOptions);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. Thank you for contacting us!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.', 
      error: error.message 
    });
  }
};