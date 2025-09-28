const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend for professional email delivery
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../build')));

// Professional email function using Resend
const sendEmailWithResend = async (name, email, project, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Hunter Johanson <contact@tornadoaudio.net>', // Your professional email address
      to: [process.env.RECIPIENT_EMAIL],
      replyTo: email, // Client's email for easy replies
      subject: `New Project Inquiry - ${project}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Project Type:</strong> ${project}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            <em>Submitted at: ${new Date().toLocaleString()}</em><br>
            <em>Sent via TornadoAudio.net contact form</em>
          </p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    console.log('Professional email sent successfully via Resend:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
};

// Confirmation email function for users
const sendConfirmationEmail = async (name, email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Hunter Johanson <contact@tornadoaudio.net>`,
      to: [email],
      bcc: [process.env.RECIPIENT_EMAIL, email], // BCC to both owner and client
      replyTo: [email], // Client's email - when you reply, it goes to them
      subject: `Thank you for your inquiry, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <p style="color: #555;">
            Dear ${name},
          </p>
          <p style="color: #555;">
            Thank you for your interest in Tornado Audio. We have received your message and will get back to you within 24 hours.
          </p>
          <p style="color: #555;">
            In the meantime, feel free to explore our website or reach out to us on social media.
          </p>
          <p style="color: #555;">
            Best regards,<br>
            Hunter Johanson at The Tornado Audio Team
          </p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    console.log('Confirmation email sent successfully:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Confirmation email error:', error);
    throw error;
  }
};

// Copy of confirmation email for you to reply to
const sendConfirmationCopyToOwner = async (name, email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Hunter Johanson <contact@tornadoaudio.net>`,
      to: [process.env.RECIPIENT_EMAIL],
      replyTo: email, // Client's email - when you reply, it goes to them
      subject: `[COPY] Confirmation sent to ${name} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
            <h3 style="margin: 0; color: #1976d2;">📧 Copy of Confirmation Email</h3>
            <p style="margin: 5px 0 0 0; color: #555;">
              This is a copy of the confirmation email sent to <strong>${name}</strong> (${email})<br>
              <strong>💡 Pro tip:</strong> Reply to this email to send your response directly to the client!
            </p>
          </div>
          
          <div style="border: 2px dashed #ccc; padding: 20px; border-radius: 5px;">
            <h4 style="color: #666; margin-top: 0;">Email sent to client:</h4>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
              <h2 style="color: #333;">Thank you for reaching out!</h2>
              <p style="color: #555;">
                Dear ${name},
              </p>
              <p style="color: #555;">
                Thank you for your interest in Tornado Audio. We have received your message and will get back to you within 24 hours.
              </p>
              <p style="color: #555;">
                In the meantime, feel free to explore our website or reach out to us on social media.
              </p>
              <p style="color: #555;">
                Best regards,<br>
                The Tornado Audio Team
              </p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f1f8e9; border-radius: 5px; border-left: 4px solid #4caf50;">
            <h4 style="margin: 0 0 10px 0; color: #388e3c;">🚀 Quick Actions:</h4>
            <p style="margin: 0; color: #555;">
              • <strong>Reply to this email</strong> to send a personal message to ${name}<br>
              • <strong>Client email:</strong> ${email}<br>
              • <strong>Auto-reply is set up</strong> - your reply will go directly to them
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    console.log('Confirmation copy sent to owner successfully:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Confirmation copy email error:', error);
    throw error;
  }
};

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, project, message } = req.body;

    // Validation
    if (!name || !email || !project || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Professional email functionality using Resend
    if (process.env.RESEND_ENABLED === 'true') {
      try {
        await sendEmailWithResend(name, email, project, message);
        console.log('Professional email sent successfully');
      } catch (emailError) {
        console.error('Professional email error:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Confirmation email functionality
    if (process.env.RESEND_ENABLED === 'true') {
      try {
        // Send confirmation to user
        await sendConfirmationEmail(name, email);
        console.log('Confirmation email sent successfully');

        // Send copy to owner for easy replying
        // await sendConfirmationCopyToOwner(name, email);
        console.log('Confirmation copy sent to owner successfully');
      } catch (confirmationEmailError) {
        console.error('Confirmation email error:', confirmationEmailError);
        // Don't fail the entire request if confirmation email fails
      }
    }

    res.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tornado Audio API is running' });
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
