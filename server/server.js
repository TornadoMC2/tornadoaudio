const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const BUILD_DIR = path.join(__dirname, '../build');

// SMTP transport. Credentials live in server/.env - see SETUP_GUIDE.md
const MAIL_ENABLED = process.env.MAIL_ENABLED === 'true';

const transporter = MAIL_ENABLED
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      // true for port 465 (implicit TLS), false for 587 (STARTTLS)
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

if (transporter) {
  transporter.verify()
    .then(() => console.log('SMTP connection verified'))
    .catch((err) => console.error('SMTP verification failed:', err.message));
} else {
  console.warn('MAIL_ENABLED is not "true" - contact form will accept submissions without sending email');
}

app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  next();
});

app.use(express.static(BUILD_DIR));

// SEO files need their own content type and a shorter cache than hashed assets
const seoFile = (route, contentType, maxAge) => {
  app.get(route, (req, res) => {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    res.sendFile(path.join(BUILD_DIR, route));
  });
};

seoFile('/sitemap.xml', 'application/xml', 86400);
seoFile('/robots.txt', 'text/plain', 86400);
seoFile('/manifest.json', 'application/json', 86400);

// Escape user input before it goes into an HTML email body
const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const fromAddress = () => {
  const name = process.env.MAIL_FROM_NAME || 'Tornado Audio';
  const address = process.env.MAIL_FROM || process.env.SMTP_USER;
  return `"${name}" <${address}>`;
};

const sendNotificationEmail = async (name, email, project, message) => {
  const info = await transporter.sendMail({
    from: fromAddress(),
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email,
    subject: `New Project Inquiry - ${project}`,
    text: `Name: ${name}\nEmail: ${email}\nProject: ${project}\n\n${message}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
        <h2 style="border-bottom: 1px solid #d6d3d1; padding-bottom: 10px; font-weight: 600;">
          New contact form submission
        </h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Project type:</strong> ${escapeHtml(project)}</p>
        <h3 style="font-weight: 600; margin-top: 24px;">Message</h3>
        <p style="border-left: 3px solid #1d4ed8; padding-left: 12px; white-space: pre-wrap;">${escapeHtml(message)}</p>
        <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 30px 0;">
        <p style="color: #78716c; font-size: 12px;">
          Submitted ${new Date().toLocaleString()} via tornadoaudio.net
        </p>
      </div>
    `
  });

  return info.messageId;
};

const sendConfirmationEmail = async (name, email) => {
  const info = await transporter.sendMail({
    from: fromAddress(),
    to: email,
    bcc: process.env.RECIPIENT_EMAIL,
    subject: `Thank you for your inquiry, ${name}`,
    text: `Hi ${name},\n\nThanks for reaching out to Tornado Audio. I've received your message and will get back to you within 24 hours.\n\nBest,\nHunter Johanson`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to Tornado Audio. I've received your message and will get back to you within 24 hours.</p>
        <p>Best,<br>Hunter Johanson</p>
      </div>
    `
  });

  return info.messageId;
};

// Small in-memory rate limit so the public contact endpoint can't be hammered.
// Resets on restart, which is fine for a single-instance deploy.
const submissions = new Map();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_MAX) {
    submissions.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissions.set(ip, recent);
  return false;
};

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, project, message } = req.body;

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

    if (rateLimited(req.ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please try again later.'
      });
    }

    if (transporter) {
      try {
        await sendNotificationEmail(name, email, project, message);
      } catch (err) {
        console.error('Notification email failed:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Could not send your message. Please email hunter@tornadoaudio.net directly.'
        });
      }

      // A failed confirmation shouldn't fail the request - the inquiry already landed
      try {
        await sendConfirmationEmail(name, email);
      } catch (err) {
        console.error('Confirmation email failed:', err.message);
      }
    }

    res.json({
      success: true,
      message: "Thank you for your message! I'll get back to you within 24 hours."
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    mail: MAIL_ENABLED ? 'enabled' : 'disabled',
    sitemap: fs.existsSync(path.join(BUILD_DIR, 'sitemap.xml')) ? 'available' : 'missing'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
