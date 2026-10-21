const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getViewsByRange, incrementDailyViews } = require('../utils/viewStats');

const router = express.Router();
const prisma = new PrismaClient();

// Trusted search engine bots — allowed to access articles but should NOT count as views
const TRUSTED_BOTS = [
  'googlebot', 'adsbot-google', 'googleother', 'google-inspectiontool',
  'apis-google', 'bingbot', 'duckduckbot', 'slurp', 'baiduspider', 'yandexbot',
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'telegrambot',
  'whatsapp', 'slackbot', 'discordbot', 'applebot', 'petalbot'
];

// Suspicious bot signatures — should not count as views
const SUSPICIOUS_BOTS = [
  'sqlmap', 'nikto', 'acunetix', 'nmap', 'masscan', 'gobuster',
  'dirbuster', 'python-requests', 'httpclient', 'curl/', 'wget/',
  'scrapy', 'zgrab', 'semrush', 'ahrefsbot', 'mj12bot', 'dotbot',
  'bytespider', 'amazonbot', 'crawler', 'spider', 'bot/'
];

const isBotUserAgent = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  if (!ua || ua.trim().length === 0) return true; // No UA = likely bot
  return TRUSTED_BOTS.some(sig => ua.includes(sig)) || SUSPICIOUS_BOTS.some(sig => ua.includes(sig));
};

// Track page view
router.post('/pageview', [
  body('page').notEmpty(),
  body('userId').optional().isString(),
  body('sessionId').optional().isString(),
  body('referrer').optional().isString(),
  body('userAgent').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { page, userId, sessionId, referrer, userAgent } = req.body;

    // Create analytics entry
    await prisma.userAnalytics.create({
      data: {
        pageViews: 1,
        uniqueVisitors: userId ? 1 : 0,
        userId: userId || null,
        date: new Date()
      }
    });

    res.json({
      message: 'Page view tracked successfully'
    });
  } catch (error) {
    console.error('Track pageview error:', error);
    res.status(500).json({
      error: 'Failed to track page view',
      message: 'Could not track page view'
    });
  }
});

// Track article view
router.post('/article/:articleId/view', [
  body('timeOnPage').optional().isInt({ min: 0 }),
  body('userId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { articleId } = req.params;
    const { timeOnPage, userId } = req.body;


    // Check if article exists and increment its view count
    const article = await prisma.post.findUnique({
      where: { id: articleId },
      select: { id: true, viewCount: true, title: true, authorId: true }
    });

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist'
      });
    }

    const updated = await prisma.post.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true }
    });

    incrementDailyViews(new Date(), 1);

    // Send milestone notification to author (non-blocking)
    try {
      const { notifyPostMilestoneIfNeeded } = require('../controllers/postsController');
      if (typeof notifyPostMilestoneIfNeeded === 'function') {
        const fullPost = await prisma.post.findUnique({
          where: { id: articleId },
          include: {
            author: { select: { id: true, firstName: true, lastName: true, username: true, email: true, isActive: true } }
          }
        });
        if (fullPost) {
          Promise.resolve()
            .then(() => notifyPostMilestoneIfNeeded(fullPost, updated.viewCount))
            .catch(() => {});
        }
      }
    } catch {}

    res.json({
      success: true,
      message: 'Article view tracked successfully',
      viewCount: updated.viewCount
    });
  } catch (error) {
    console.error('Track article view error:', error);
    res.status(500).json({
      error: 'Failed to track article view',
      message: 'Could not track article view'
    });
  }
});

// Admin view analytics with range filters (daily, monthly, yearly, 2y, 3y, 5y)
router.get('/admin/views', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const range = String(req.query.range || 'daily').toLowerCase();
    const allowedRanges = ['daily', 'monthly', 'yearly', '2y', '3y', '5y', 'overview'];
    const safeRange = allowedRanges.includes(range) ? range : 'daily';

    let result;
    if (safeRange === 'overview') {
      // Compute overview stats from the daily view-stats file + DB lifetime
      // (all keys are in Africa/Kigali local time)
      const { loadStats, toDateKey, shiftDateKey, shiftMonthKey } = require('../utils/viewStats');
      const stats = loadStats();
      const byDate = stats.byDate || {};

      const todayKey = toDateKey(new Date());
      const yesterdayKey = shiftDateKey(todayKey, -1);

      // This week (last 7 days including today)
      let thisWeek = 0;
      for (let i = 0; i < 7; i++) {
        thisWeek += byDate[shiftDateKey(todayKey, -i)] || 0;
      }

      // This month (current month)
      const monthPrefix = todayKey.slice(0, 7);
      let thisMonth = 0;
      let lastMonth = 0;
      const lastMonthPrefix = shiftMonthKey(monthPrefix, -1);
      for (const [key, views] of Object.entries(byDate)) {
        if (key.startsWith(monthPrefix)) thisMonth += views;
        if (key.startsWith(lastMonthPrefix)) lastMonth += views;
      }

      // Lifetime from DB (sum of all post viewCount)
      const aggregate = await prisma.post.aggregate({ _sum: { viewCount: true } });
      const lifetime = aggregate._sum.viewCount || 0;

      result = {
        today: byDate[todayKey] || 0,
        yesterday: byDate[yesterdayKey] || 0,
        thisWeek,
        thisMonth,
        lastMonth,
        lifetime,
      };
    } else {
      result = getViewsByRange(safeRange);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Admin view analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get view analytics',
      message: error?.message || 'Internal server error',
    });
  }
});

// Get analytics summary (authenticated users)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const totalPosts = await prisma.post.count({
      where: { status: 'PUBLISHED' }
    });

    const totalUsers = await prisma.user.count();

    const recentActivity = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        title: true,
        viewCount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      summary: {
        totalPosts,
        totalUsers
      },
      recentActivity
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({
      error: 'Failed to get analytics summary',
      message: 'Could not retrieve analytics summary'
    });
  }
});

module.exports = router;
