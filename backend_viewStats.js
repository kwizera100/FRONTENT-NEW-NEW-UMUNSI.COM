const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../../data/view-stats.json');

const toDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toMonthKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const toYearKey = (date = new Date()) => {
  return String(date.getFullYear());
};

const ensureDataFile = () => {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    const initial = {
      byDate: {},
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2), 'utf8');
  }
};

const loadStats = () => {
  ensureDataFile();

  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    return {
      byDate: parsed.byDate || {},
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    return {
      byDate: {},
      updatedAt: new Date().toISOString(),
    };
  }
};

const saveStats = (stats) => {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(stats, null, 2), 'utf8');
};

const incrementDailyViews = (date = new Date(), amount = 1) => {
  const stats = loadStats();
  const dateKey = toDateKey(date);

  stats.byDate[dateKey] = (stats.byDate[dateKey] || 0) + amount;
  stats.updatedAt = new Date().toISOString();

  // Keep only the last 365 days to prevent unbounded growth.
  const keys = Object.keys(stats.byDate).sort();
  if (keys.length > 365) {
    const keysToDelete = keys.slice(0, keys.length - 365);
    for (const key of keysToDelete) {
      delete stats.byDate[key];
    }
  }

  saveStats(stats);
};

const getTodayViews = () => {
  const stats = loadStats();
  const todayKey = toDateKey(new Date());
  return stats.byDate[todayKey] || 0;
};

const getDailyViews = (days = 7) => {
  const stats = loadStats();
  const result = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = toDateKey(day);
    result.push({
      date: key,
      views: stats.byDate[key] || 0,
    });
  }

  return result;
};

const getMonthlyViews = (months = 12) => {
  const stats = loadStats();
  const result = [];
  const today = new Date();
  const byMonth = {};

  // Aggregate all known daily stats into months.
  for (const [key, views] of Object.entries(stats.byDate)) {
    const monthKey = key.slice(0, 7); // YYYY-MM
    byMonth[monthKey] = (byMonth[monthKey] || 0) + views;
  }

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = toMonthKey(month);
    result.push({
      month: key,
      views: byMonth[key] || 0,
    });
  }

  return result;
};

const getYearlyViews = (years = 5) => {
  const stats = loadStats();
  const result = [];
  const today = new Date();
  const byYear = {};

  for (const [key, views] of Object.entries(stats.byDate)) {
    const yearKey = key.slice(0, 4); // YYYY
    byYear[yearKey] = (byYear[yearKey] || 0) + views;
  }

  for (let i = years - 1; i >= 0; i--) {
    const year = new Date(today.getFullYear() - i, 0, 1);
    const key = toYearKey(year);
    result.push({
      year: key,
      views: byYear[key] || 0,
    });
  }

  return result;
};

const RANGE_HANDLERS = {
  daily: () => ({ totalDays: 30, handler: () => ({ period: 'daily', granularity: 'day', data: getDailyViews(30) }) }),
  monthly: () => ({ totalDays: 365, handler: () => ({ period: 'monthly', granularity: 'month', data: getMonthlyViews(12) }) }),
  yearly: () => ({ totalDays: 365, handler: () => ({ period: 'yearly', granularity: 'month', data: getMonthlyViews(12) }) }),
  '2y': () => ({ totalDays: 730, handler: () => ({ period: '2y', granularity: 'month', data: getMonthlyViews(24) }) }),
  '3y': () => ({ totalDays: 1095, handler: () => ({ period: '3y', granularity: 'year', data: getYearlyViews(3) }) }),
  '5y': () => ({ totalDays: 1825, handler: () => ({ period: '5y', granularity: 'year', data: getYearlyViews(5) }) }),
};

const getViewsByRange = (range = 'daily') => {
  const entry = RANGE_HANDLERS[range] || RANGE_HANDLERS.daily;
  const { handler } = entry();
  const { period, granularity, data } = handler();
  const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);

  const from = data.length > 0 ? (data[0].date || data[0].month || data[0].year) : null;
  const to = data.length > 0 ? (data[data.length - 1].date || data[data.length - 1].month || data[data.length - 1].year) : null;

  return {
    period,
    granularity,
    from,
    to,
    totalViews,
    data,
  };
};

module.exports = {
  incrementDailyViews,
  getTodayViews,
  getDailyViews,
  getMonthlyViews,
  getYearlyViews,
  getViewsByRange,
};
