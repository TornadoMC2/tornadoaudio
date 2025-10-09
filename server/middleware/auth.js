const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT token
 * Add to any route that needs protection
 */
function authenticateToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No authentication token provided.'
    });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
}

/**
 * Middleware to check if user is admin
 * Use after authenticateToken
 */
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.'
    });
  }
}

/**
 * Simple API key authentication (easier alternative)
 * Checks for API key in header or query parameter
 */
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Access denied. API key required.'
    });
  }

  // Check against environment variable
  if (apiKey !== process.env.ANALYTICS_API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key.'
    });
  }

  next();
}

/**
 * Rate limiting for API endpoints
 * Prevents abuse even if someone gets the API key
 */
const requestCounts = new Map();

function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
               req.connection.remoteAddress ||
               req.ip;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create request log for this IP
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);

    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      for (const [key, times] of requestCounts.entries()) {
        const recent = times.filter(time => time > windowStart);
        if (recent.length === 0) {
          requestCounts.delete(key);
        } else {
          requestCounts.set(key, recent);
        }
      }
    }

    next();
  };
}

/**
 * IP whitelist middleware (optional extra security)
 * Only allow specific IP addresses to access
 */
function ipWhitelist(allowedIPs = []) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
               req.connection.remoteAddress ||
               req.ip;

    // If no whitelist is configured, allow all (fallback to other auth)
    if (allowedIPs.length === 0) {
      return next();
    }

    if (allowedIPs.includes(ip)) {
      next();
    } else {
      return res.status(403).json({
        error: 'Access denied. IP not whitelisted.'
      });
    }
  };
}

module.exports = {
  authenticateToken,
  requireAdmin,
  authenticateApiKey,
  rateLimit,
  ipWhitelist
};

