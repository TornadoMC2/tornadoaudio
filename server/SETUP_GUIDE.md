# Contact Form Backend Setup Guide

This guide will help you set up the backend functionality for the TornadoAudio contact form with both email and Google Sheets integration.

## Prerequisites

1. Node.js installed on your system
2. A Gmail account (for email functionality)
3. A Google account (for Google Sheets functionality)

## Installation

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

## Configuration Options

You can choose to use either email, Google Sheets, or both:

### Option 1: Email Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App Passwords
   - Generate a password for "Mail"
   
3. **Update your .env file:**
   ```env
   EMAIL_ENABLED=true
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   RECIPIENT_EMAIL=hunterjohanson04@gmail.com
   ```

### Option 2: Google Sheets Setup

1. **Create a Google Sheet:**
   - Create a new Google Sheet
   - Add headers in row 1: Date, Name, Email, Project Type, Message, Status
   - Copy the Sheet ID from the URL

2. **Set up Google Service Account:**
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON key file
   - Share your Google Sheet with the service account email

3. **Update your .env file:**
   ```env
   GOOGLE_SHEETS_ENABLED=true
   GOOGLE_SHEET_ID=your_google_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./path/to/service-account-key.json
   ```

## Running the Backend

1. **Development mode:**
   ```bash
   cd server
   npm run dev
   ```

2. **Production mode:**
   ```bash
   cd server
   npm start
   ```

The server will run on http://localhost:3001

## Features

### Contact Form Integration
- Form submissions from the pricing section automatically populate with selected service
- Smooth scrolling from "Get Started" buttons to contact form
- Real-time form validation and user feedback

### Email Notifications
- Sends formatted HTML emails to your specified address
- Includes all form data with timestamps
- Professional email template

### Google Sheets Integration
- Automatically adds form submissions to your spreadsheet
- Includes timestamp and status tracking
- Easy to export and manage leads

### Error Handling
- Graceful error handling for both email and sheets
- User-friendly error messages
- Server continues running even if one service fails

## Testing

1. Start the backend server
2. Fill out the contact form on your website
3. Check your email inbox and/or Google Sheet

## Troubleshooting

### Email Issues
- Make sure you're using an App Password, not your regular Gmail password
- Check that 2FA is enabled on your Google account
- Verify the EMAIL_USER matches the account that generated the App Password

### Google Sheets Issues
- Ensure the service account has edit access to your sheet
- Check that the Google Sheets API is enabled in your Google Cloud project
- Verify the GOOGLE_SHEET_ID is correct (found in the sheet URL)

## Security Notes

- Never commit your .env file to version control
- Keep your service account key file secure
- Use environment variables for all sensitive data
- Consider using a dedicated email account for form submissions
