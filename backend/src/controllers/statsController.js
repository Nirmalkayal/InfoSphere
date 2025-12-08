const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const Lock = require('../models/Lock');
const Slot = require('../models/Slot');
const Turf = require('../models/Turf');

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const colorMap = {
  SportifyPro: 'hsl(262, 83%, 58%)',
  Playo: 'hsl(24, 95%, 53%)',
  Internal: 'hsl(160, 84%, 39%)',
  Other: 'hsl(199, 89%, 48%)',
};

exports.getPerformanceData = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(monthNames.map(m => ({ month: m, value: 0 })));
    }
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const agg = await AuditLog.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      { $group: { _id: { m: { $month: '$createdAt' } }, value: { $sum: 1 } } },
      { $sort: { '_id.m': 1 } },
    ]);
    const data = monthNames.map((name, idx) => ({
      month: name,
      value: agg.find(x => x._id.m === idx + 1)?.value || 0,
    }));
    res.json(data);
  } catch (err) {
    res.json(monthNames.map(m => ({ month: m, value: 0 })));
  }
};

exports.getPlatformDistribution = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const agg = await Lock.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]);
    const total = agg.reduce((s, a) => s + a.count, 0) || 1;
    const data = agg.map(a => {
      const name = a._id || 'Other';
      const value = Math.round((a.count / total) * 100);
      return { name, value, color: colorMap[name] || colorMap.Other };
    });
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ totalApiCalls: 0, activeIntegrations: 0, registeredGrounds: 0, failedRequests: 0 });
    }
    const totalApiCalls = await AuditLog.countDocuments();
    const registeredGrounds = await Turf.countDocuments();
    const platforms = await AuditLog.distinct('platform');
    const activeIntegrations = platforms.length;
    const failedRequests = await AuditLog.countDocuments({ action: 'lock_expired' });
    res.json({ totalApiCalls, activeIntegrations, registeredGrounds, failedRequests });
  } catch (err) {
    res.json({ totalApiCalls: 0, activeIntegrations: 0, registeredGrounds: 0, failedRequests: 0 });
  }
};

exports.getChannelData = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const agg = await Slot.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]);
    const total = agg.reduce((s, a) => s + a.count, 0) || 1;
    const data = agg.map(a => {
      const name = a._id || 'Other';
      const mapClass = name === 'SportifyPro' ? 'bg-sportify' : name === 'Playo' ? 'bg-playo' : name === 'Internal' ? 'bg-internal' : 'bg-primary';
      return { name, traffic: Math.round((a.count / total) * 100), color: mapClass };
    });
    res.json(data);
  } catch (err) {
    res.json([]);
  }
};
