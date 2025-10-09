const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const { logEvent, visitorLoggingMiddleware } = require('./utils/logger');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend for professional email delivery
const resend = new Resend(process.env.RESEND_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    logEvent('api_call', { message: 'Server started and connected to MongoDB' });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Visitor logging middleware - tracks all requests
app.use(visitorLoggingMiddleware);

// Analytics API routes
app.use('/api/analytics', analyticsRouter);

// SEO-specific middleware and headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }

  next();
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../build')));

// Specific SEO file routes with proper headers
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../build/sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../build/robots.txt'));
});

app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(path.join(__dirname, '../build/favicon.ico'));
});

app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../build/manifest.json'));
});

app.get('/logo192.png', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(path.join(__dirname, '../build/logo192.png'));
});

app.get('/logo512.png', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(path.join(__dirname, '../build/logo512.png'));
});

// Professional email function using Resend
const sendEmailWithResend = async (name, email, project, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tornado Audio <contact@tornadoaudio.net>',
      to: [process.env.RECIPIENT_EMAIL],
      replyTo: email,
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
            <em>Sent via TornadoAudio.net contact form</em><br>
            <em>Instagram: <a href="https://instagram.com/tornadoaudio_mixing" target="_blank" style="color: #4f46e5;">@tornadoaudio_mixing</a></em>
          </p>
        </div>
      `
    });

    if (error) throw error;

    console.log('Professional email sent successfully via Resend:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
};

const sendConfirmationEmail = async (name, email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Hunter Johanson <hunter@tornadoaudio.net>`,
      to: [email],
      bcc: [process.env.RECIPIENT_EMAIL, email],
      replyTo: [email],
      subject: `Thank you for your inquiry, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for reaching out!</h2>
          <p style="color: #555;">Dear ${name},</p>
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

    if (error) throw error;

    console.log('Confirmation email sent successfully:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Confirmation email error:', error);
    throw error;
  }
};

// Contact form submission endpoint with logging
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, project, message } = req.body;

    // Log contact form submission
    await logEvent('contact_form_submission', {
      name,
      email,
      project,
      messageLength: message?.length || 0
    }, req);

    // Validation
    if (!name || !email || !project || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send emails with logging
    if (process.env.RESEND_ENABLED === 'true') {
      try {
        const emailResult = await sendEmailWithResend(name, email, project, message);
        await logEvent('email_sent', {
          recipient: email,
          emailId: emailResult.id,
          emailType: 'contact_notification'
        }, req);
      } catch (emailError) {
        await logEvent('email_failed', {
          recipient: email,
          emailType: 'contact_notification',
          error: emailError.message
        }, req, false, emailError);
      }

      try {
        const confirmResult = await sendConfirmationEmail(name, email);
        await logEvent('email_sent', {
          recipient: email,
          emailId: confirmResult.id,
          emailType: 'confirmation'
        }, req);
      } catch (confirmationError) {
        await logEvent('email_failed', {
          recipient: email,
          emailType: 'confirmation',
          error: confirmationError.message
        }, req, false, confirmationError);
      }
    }

    res.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    await logEvent('error', {
      endpoint: '/api/contact',
      error: error.message
    }, req, false, error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check endpoint with MongoDB status
app.get('/api/health', (req, res) => {
  const fs = require('fs');
  const sitemapExists = fs.existsSync(path.join(__dirname, '../build/sitemap.xml'));
  const robotsExists = fs.existsSync(path.join(__dirname, '../build/robots.txt'));

  res.json({
    status: 'OK',
    message: 'Tornado Audio API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    seo: {
      sitemap: sitemapExists ? 'Available' : 'Missing',
      robots: robotsExists ? 'Available' : 'Missing',
      sitemapUrl: 'http://localhost:3001/sitemap.xml',
      robotsUrl: 'http://localhost:3001/robots.txt'
    }
  });
});

// SEO test endpoint
app.get('/api/seo-check', (req, res) => {
  const fs = require('fs');
  const buildPath = path.join(__dirname, '../build');

  const seoFiles = {
    sitemap: fs.existsSync(path.join(buildPath, 'sitemap.xml')),
    robots: fs.existsSync(path.join(buildPath, 'robots.txt')),
    favicon: fs.existsSync(path.join(buildPath, 'favicon.ico')),
    manifest: fs.existsSync(path.join(buildPath, 'manifest.json')),
    logo192: fs.existsSync(path.join(buildPath, 'logo192.png')),
    logo512: fs.existsSync(path.join(buildPath, 'logo512.png'))
  };

  const urls = {
    sitemap: `${req.protocol}://${req.get('host')}/sitemap.xml`,
    robots: `${req.protocol}://${req.get('host')}/robots.txt`,
    favicon: `${req.protocol}://${req.get('host')}/favicon.ico`,
    manifest: `${req.protocol}://${req.get('host')}/manifest.json`,
    logo192: `${req.protocol}://${req.get('host')}/logo192.png`,
    logo512: `${req.protocol}://${req.get('host')}/logo512.png`
  };

  res.json({
    message: 'SEO Files Status Check',
    files: seoFiles,
    urls: urls,
    allFilesPresent: Object.values(seoFiles).every(exists => exists)
  });
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Analytics available at: http://localhost:${PORT}/api/analytics/summary`);
  console.log(`Sitemap available at: http://localhost:${PORT}/sitemap.xml`);
  console.log(`Robots.txt available at: http://localhost:${PORT}/robots.txt`);
  console.log(`SEO check available at: http://localhost:${PORT}/api/seo-check`);
});

