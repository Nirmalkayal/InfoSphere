const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
// Auth disabled for admin routes per requirement

router.post('/login', authController.login);
router.get('/stats', adminController.stats);
router.get('/api-keys', adminController.listApiKeys);
router.get('/turfs', adminController.listTurfs);
router.get('/users', adminController.listUsers);
router.get('/logs', adminController.listLogs);
router.get('/slots', adminController.listSlots);
router.get('/dashboard-metrics', adminController.dashboardMetrics);

module.exports = router;
