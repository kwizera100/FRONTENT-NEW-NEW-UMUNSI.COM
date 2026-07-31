const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getViewsByRange } = require('../utils/viewStats');

const router = express.Router();
const prisma = new PrismaClient();

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

    // Check if article exists
    const article = await prisma.post.findUnique({
      where: { id: articleId },
      select: { id: true }
    });

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist'
      });
    }

    res.json({
      message: 'Article view tracked successfully'
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
router.get('/admin/views', requireAdmin, async (req, res) => {
  try {
    const range = String(req.query.range || 'daily').toLowerCase();
    const allowedRanges = ['daily', 'monthly', 'yearly', '2y', '3y', '5y'];
    const safeRange = allowedRanges.includes(range) ? range : 'daily';

    const result = getViewsByRange(safeRange);

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
