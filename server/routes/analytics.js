const express = require('express');
const router = express.Router();
const VisitorLog = require('../models/VisitorLog');
const EventLog = require('../models/EventLog');
const { authenticateApiKey, rateLimit } = require('../middleware/auth');

// Apply authentication and rate limiting to all analytics routes
router.use(authenticateApiKey);
router.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

/**
 * GET /api/analytics/summary
 * Get overall statistics
 */
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalVisits,
      todayVisits,
      weekVisits,
      monthVisits,
      totalEvents,
      contactSubmissions,
      emailsSent,
      emailsFailed
    ] = await Promise.all([
      VisitorLog.countDocuments(),
      VisitorLog.countDocuments({ timestamp: { $gte: todayStart } }),
      VisitorLog.countDocuments({ timestamp: { $gte: weekStart } }),
      VisitorLog.countDocuments({ timestamp: { $gte: monthStart } }),
      EventLog.countDocuments(),
      EventLog.countDocuments({ eventType: 'contact_form_submission' }),
      EventLog.countDocuments({ eventType: 'email_sent', success: true }),
      EventLog.countDocuments({ eventType: 'email_failed', success: false })
    ]);

    res.json({
      visitors: {
        total: totalVisits,
        today: todayVisits,
        last7Days: weekVisits,
        last30Days: monthVisits
      },
      events: {
        total: totalEvents,
        contactSubmissions,
        emailsSent,
        emailsFailed
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

/**
 * GET /api/analytics/top-pages
 * Get most visited pages
 */
router.get('/top-pages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topPages = await VisitorLog.aggregate([
      { $group: { _id: '$path', visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: limit },
      { $project: { path: '$_id', visits: 1, _id: 0 } }
    ]);

    res.json(topPages);
  } catch (error) {
    console.error('Top pages error:', error);
    res.status(500).json({ error: 'Failed to fetch top pages' });
  }
});

/**
 * GET /api/analytics/traffic-by-country
 * Get visitor distribution by country
 */
router.get('/traffic-by-country', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const countries = await VisitorLog.aggregate([
      { $group: { _id: '$country', visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
      { $limit: limit },
      { $project: { country: '$_id', visitors: 1, _id: 0 } }
    ]);

    res.json(countries);
  } catch (error) {
    console.error('Traffic by country error:', error);
    res.status(500).json({ error: 'Failed to fetch traffic by country' });
  }
});

/**
 * GET /api/analytics/browsers
 * Get browser distribution
 */
router.get('/browsers', async (req, res) => {
  try {
    const browsers = await VisitorLog.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { browser: '$_id', count: 1, _id: 0 } }
    ]);

    res.json(browsers);
  } catch (error) {
    console.error('Browsers error:', error);
    res.status(500).json({ error: 'Failed to fetch browser stats' });
  }
});

/**
 * GET /api/analytics/devices
 * Get device type distribution
 */
router.get('/devices', async (req, res) => {
  try {
    const devices = await VisitorLog.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { device: '$_id', count: 1, _id: 0 } }
    ]);

    res.json(devices);
  } catch (error) {
    console.error('Devices error:', error);
    res.status(500).json({ error: 'Failed to fetch device stats' });
  }
});

/**
 * GET /api/analytics/recent-contacts
 * Get recent contact form submissions
 */
router.get('/recent-contacts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const contacts = await EventLog.find({
      eventType: 'contact_form_submission'
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('timestamp eventData country region')
      .lean();

    res.json(contacts);
  } catch (error) {
    console.error('Recent contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch recent contacts' });
  }
});

/**
 * GET /api/analytics/errors
 * Get recent errors
 */
router.get('/errors', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const errors = await EventLog.find({
      $or: [
        { eventType: 'error' },
        { eventType: 'email_failed' }
      ]
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('timestamp eventType eventData errorMessage country')
      .lean();

    res.json(errors);
  } catch (error) {
    console.error('Errors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch errors' });
  }
});

/**
 * GET /api/analytics/referrers
 * Get top referrers
 */
router.get('/referrers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const referrers = await VisitorLog.aggregate([
      { $match: { referrer: { $ne: 'Direct' } } },
      { $group: { _id: '$referrer', visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: limit },
      { $project: { referrer: '$_id', visits: 1, _id: 0 } }
    ]);

    res.json(referrers);
  } catch (error) {
    console.error('Referrers error:', error);
    res.status(500).json({ error: 'Failed to fetch referrers' });
  }
});

/**
 * GET /api/analytics/daily-visits
 * Get daily visit counts for the last N days
 */
router.get('/daily-visits', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyVisits = await VisitorLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          visits: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', visits: 1, _id: 0 } }
    ]);

    res.json(dailyVisits);
  } catch (error) {
    console.error('Daily visits error:', error);
    res.status(500).json({ error: 'Failed to fetch daily visits' });
  }
});

module.exports = router;
