const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration using Nodemailer
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use app password for Gmail
    }
  });
};

// Google Sheets configuration
const setupGoogleSheets = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account key
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Google Sheets setup error:', error);
    return null;
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

    // Email functionality
    if (process.env.EMAIL_ENABLED === 'true') {
      try {
        const transporter = createEmailTransporter();

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RECIPIENT_EMAIL,
          subject: `New Project Inquiry - ${project}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Project Type:</strong> ${project}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    // Google Sheets functionality
    if (process.env.GOOGLE_SHEETS_ENABLED === 'true') {
      try {
        const sheets = await setupGoogleSheets();

        if (sheets) {
          const spreadsheetId = process.env.GOOGLE_SHEET_ID;
          const range = 'Sheet1!A:F'; // Adjust range as needed

          const values = [[
            new Date().toISOString(),
            name,
            email,
            project,
            message,
            'New' // Status column
          ]];

          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values }
          });

          console.log('Data added to Google Sheets successfully');
        }
      } catch (sheetsError) {
        console.error('Google Sheets error:', sheetsError);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
