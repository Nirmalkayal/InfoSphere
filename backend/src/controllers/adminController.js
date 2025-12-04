const ApiKey = require('../models/ApiKey');
const Turf = require('../models/Turf');
const Slot = require('../models/Slot');
const User = require('../models/User');
const IntegrationLog = require('../models/IntegrationLog');

exports.stats = async (req, res) => {
  try {
    const totalApiCalls = await IntegrationLog.countDocuments();
    const failedRequests = await IntegrationLog.countDocuments({ status: 'failed' });
    const turfs = await Turf.find();
    const registeredGrounds = turfs.reduce((sum, t) => sum + (t.grounds || 0), 0);
    const activeIntegrations = await ApiKey.countDocuments({ revoked: false });

    res.json({
      uptime: process.uptime(),
      totalApiCalls,
      failedRequests,
      registeredGrounds,
      activeIntegrations,
    });
  } catch (err) {
    res.json({
      uptime: process.uptime(),
      totalApiCalls: 0,
      failedRequests: 0,
      registeredGrounds: 0,
      activeIntegrations: 0,
    });
  }
};

exports.listApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find().sort('-createdAt');
    const data = keys.map(k => ({
      id: k._id.toString(),
      key: k.key,
      platform: k.platform || 'Internal',
      status: k.revoked ? 'expired' : 'active',
      lastUsedAt: k.lastUsedAt,
      rateLimitPerHour: k.rateLimitPerHour || 0,
      createdAt: k.createdAt,
    }));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.listTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().sort('name');
    const availableSlotsByTurf = await Slot.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$turf', count: { $sum: 1 } } }
    ]);
    const availableMap = Object.fromEntries(availableSlotsByTurf.map(x => [x._id?.toString(), x.count]));
    const data = turfs.map(t => ({
      id: t._id.toString(),
      name: t.name,
      location: t.location,
      grounds: t.grounds || 0,
      availableSlots: availableMap[t._id.toString()] || 0,
      integrations: t.integrations || 0,
      status: t.status || 'active',
    }));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort('name');
    const data = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      lastActiveAt: u.lastActiveAt,
      avatar: u.avatar,
    }));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.listLogs = async (req, res) => {
  try {
    const logs = await IntegrationLog.find().sort('-occurredAt').limit(500);
    const data = logs.map(l => ({
      id: l._id.toString(),
      timestamp: l.occurredAt,
      platform: l.platform,
      endpoint: l.endpoint,
      method: l.method,
      status: l.status,
      responseTimeMs: l.responseTimeMs || 0,
      dataRequested: l.dataRequested || '',
    }));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.listSlots = async (req, res) => {
  try {
    const { from, to, turfId } = req.query;
    const query = {};
    if (from && to) {
      query.start = { $gte: new Date(from) };
      query.end = { $lte: new Date(to) };
    }
    if (turfId) query.turf = turfId;
    const slots = await Slot.find(query).sort('start');
    const data = slots.map(s => ({
      id: s._id.toString(),
      start: s.start,
      end: s.end,
      status: s.status,
      platform: s.groundName ? 'internal' : 'other',
      apiKey: undefined,
      groundName: s.groundName,
      customerName: s.customerName,
    }));
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.dashboardMetrics = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const perfAgg = await IntegrationLog.aggregate([
      { $match: { occurredAt: { $gte: startOfYear } } },
      { $group: { _id: { m: { $month: '$occurredAt' } }, value: { $sum: 1 } } },
      { $sort: { '_id.m': 1 } }
    ]);
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const performanceData = monthNames.map((name, idx) => ({ month: name, value: perfAgg.find(x => x._id.m === idx + 1)?.value || 0 }));

    const platformAgg = await IntegrationLog.aggregate([
      { $group: { _id: '$platform', value: { $sum: 1 } } }
    ]);
    const platformData = platformAgg.map(p => ({ name: p._id || 'Other', value: p.value }));

    const totalPlatform = platformData.reduce((s, p) => s + p.value, 0) || 1;
    const channelData = platformData.map(p => ({ name: p.name, traffic: Math.round((p.value / totalPlatform) * 100) }));

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const usersToday = await User.countDocuments({ lastActiveAt: { $gte: startOfDay } });
    const goalsToday = await IntegrationLog.countDocuments({ method: 'POST', occurredAt: { $gte: startOfDay } });
    const dailyOverview = {
      users: { today: usersToday, expected: usersToday + Math.ceil(usersToday * 0.3) },
      goals: { today: goalsToday, expected: goalsToday + Math.ceil(goalsToday * 0.2) }
    };

    const turfs = await Turf.find();
    const regionCounts = {};
    for (const t of turfs) {
      const region = (t.location || '').split(',')[0] || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    }
    const topRegions = Object.entries(regionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json({ performanceData, platformData, channelData, dailyOverview, topRegions });
  } catch (err) {
    res.json({
      performanceData: [],
      platformData: [],
      channelData: [],
      dailyOverview: { users: { today: 0, expected: 0 }, goals: { today: 0, expected: 0 } },
      topRegions: [],
    });
  }
};
