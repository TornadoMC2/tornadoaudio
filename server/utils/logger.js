const geoip = require('geoip-lite');
const crypto = require('crypto');
const VisitorLog = require('../models/VisitorLog');
const EventLog = require('../models/EventLog');

/**
 * Parse user agent string to extract browser and OS info
 */
function parseUserAgent(userAgent) {
  if (!userAgent) return {};

  const result = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
    device: 'Desktop'
  };

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    result.browser = 'Chrome';
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes('Firefox')) {
    result.browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    result.browser = 'Safari';
    const match = userAgent.match(/Version\/([\d.]+)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes('Edg')) {
    result.browser = 'Edge';
    const match = userAgent.match(/Edg\/([\d.]+)/);
    if (match) result.browserVersion = match[1];
  }

  // Detect OS
  if (userAgent.includes('Windows NT 10.0')) {
    result.os = 'Windows';
    result.osVersion = '10';
  } else if (userAgent.includes('Windows NT')) {
    result.os = 'Windows';
    const match = userAgent.match(/Windows NT ([\d.]+)/);
    if (match) result.osVersion = match[1];
  } else if (userAgent.includes('Mac OS X')) {
    result.os = 'macOS';
    const match = userAgent.match(/Mac OS X ([\d_]+)/);
    if (match) result.osVersion = match[1].replace(/_/g, '.');
  } else if (userAgent.includes('Linux')) {
    result.os = 'Linux';
  } else if (userAgent.includes('Android')) {
    result.os = 'Android';
    result.device = 'Mobile';
    const match = userAgent.match(/Android ([\d.]+)/);
    if (match) result.osVersion = match[1];
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    result.os = 'iOS';
    result.device = userAgent.includes('iPad') ? 'Tablet' : 'Mobile';
    const match = userAgent.match(/OS ([\d_]+)/);
    if (match) result.osVersion = match[1].replace(/_/g, '.');
  }

  return result;
}

/**
 * Hash IP address for privacy (one-way hash)
 */
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'tornado-audio-salt')).digest('hex');
}

/**
 * Get real IP address from request (handles proxies)
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip ||
         'unknown';
}

/**
 * Log visitor information (page views, API calls)
 */
async function logVisitor(req, responseTime = 0, statusCode = 200) {
  try {
    const ip = getClientIP(req);
    const geo = geoip.lookup(ip);
    const userAgentData = parseUserAgent(req.headers['user-agent']);

    const logEntry = new VisitorLog({
      ipAddress: ip,
      ipHash: hashIP(ip),
      country: geo?.country || 'Unknown',
      region: geo?.region || 'Unknown',
      city: geo?.city || 'Unknown',
      timezone: geo?.timezone || 'Unknown',
      userAgent: req.headers['user-agent'],
      ...userAgentData,
      path: req.path,
      method: req.method,
      referrer: req.headers.referer || req.headers.referrer || 'Direct',
      responseTime,
      statusCode
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('Error logging visitor:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Log important events (contact form, emails, errors, etc.)
 */
async function logEvent(eventType, eventData, req = null, success = true, error = null) {
  try {
    let ip = 'system';
    let geo = null;
    let userAgent = null;

    if (req) {
      ip = getClientIP(req);
      geo = geoip.lookup(ip);
      userAgent = req.headers['user-agent'];
    }

    const eventLog = new EventLog({
      eventType,
      eventData,
      ipAddress: ip,
      ipHash: ip !== 'system' ? hashIP(ip) : 'system',
      country: geo?.country || 'Unknown',
      region: geo?.region || 'Unknown',
      userAgent,
      success,
      errorMessage: error?.message,
      errorStack: error?.stack
    });

    await eventLog.save();
    return eventLog;
  } catch (error) {
    console.error('Error logging event:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Middleware to automatically log all incoming requests
 */
function visitorLoggingMiddleware(req, res, next) {
  const startTime = Date.now();

  // Capture the original res.send
  const originalSend = res.send;

  res.send = function(data) {
    res.send = originalSend; // Restore original
    const responseTime = Date.now() - startTime;

    // Don't log static assets to reduce noise
    // Don't log API endpoints to prevent analytics looping when viewing dashboard
    // Don't log the analytics page itself to prevent inflating visitor counts
    const isStaticAsset = req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|map|woff|woff2|ttf)$/);

    // Check both req.path and req.url for API endpoints
    const isApiEndpoint = req.path.includes('/api/') || req.url.includes('/api/') || req.originalUrl?.includes('/api/');

    // Also check for analytics endpoints specifically
    const isAnalyticsEndpoint = req.path.includes('analytics') || req.url.includes('analytics');

    const isAnalyticsPage = req.path === '/analytics' || req.path.startsWith('/analytics/');

    // Skip logging for any of these conditions
    const shouldSkipLogging = isStaticAsset || isApiEndpoint || isAnalyticsPage || isAnalyticsEndpoint;

    // TEMPORARY DEBUG - Remove this after fixing
    // console.log(`DEBUG: ${req.method} ${req.path} (URL: ${req.url}) | Static: ${!!isStaticAsset} | API: ${!!isApiEndpoint} | Analytics: ${!!isAnalyticsEndpoint} | Skip: ${shouldSkipLogging}`);

    if (!shouldSkipLogging) {
      console.log(`LOGGING VISITOR: ${req.method} ${req.path}`);
      logVisitor(req, responseTime, res.statusCode).catch(err => {
        console.error('Visitor logging failed:', err);
      });
    }

    return res.send(data);
  };

  next();
}

module.exports = {
  logVisitor,
  logEvent,
  visitorLoggingMiddleware,
  getClientIP,
  parseUserAgent,
  hashIP
};
