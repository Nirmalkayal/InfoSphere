const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const statsController = require('../controllers/statsController');

router.post('/login', authController.login);
router.get('/stats', adminController.stats);
router.get('/api-keys', adminController.listApiKeys);
router.get('/turfs', adminController.listTurfs);
router.get('/users', adminController.listUsers);
router.get('/logs', adminController.listLogs);
router.get('/slots', adminController.listSlots);
router.get('/dashboard-metrics', adminController.dashboardMetrics);

router.get('/stats/performance', statsController.getPerformanceData);
router.get('/stats/platform', statsController.getPlatformDistribution);
router.get('/stats/dashboard', statsController.getDashboardStats);
router.get('/stats/channels', statsController.getChannelData);

module.exports = router;
