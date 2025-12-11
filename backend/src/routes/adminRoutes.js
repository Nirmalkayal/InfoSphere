const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const statsController = require('../controllers/statsController');

const jwtAuth = require('../middleware/jwtAuth');
const tenantMiddleware = require('../middleware/tenantMiddleware');

const roleCheck = require('../middleware/roleCheck');

router.post('/login', authController.login);

// Protect all routes below this line
router.use(jwtAuth);
router.use(tenantMiddleware);

router.get('/stats', adminController.stats);
// Only Admin can view API keys
router.get('/api-keys', roleCheck(['admin']), adminController.listApiKeys);
router.get('/turfs', adminController.listTurfs);
router.get('/users', adminController.listUsers);
router.get('/logs', adminController.listLogs);
router.get('/slots', adminController.listSlots);
router.get('/dashboard-metrics', adminController.dashboardMetrics);

const paymentController = require('../controllers/paymentController');

router.get('/stats/performance', statsController.getPerformanceData);
router.get('/stats/platform', statsController.getPlatformDistribution);
router.get('/stats/dashboard', statsController.getDashboardStats);
router.get('/stats/channels', statsController.getChannelData);

// Payment Routes
router.post('/payment/create-order', paymentController.createOrder);
router.post('/payment/verify', paymentController.verifyPayment);

const invoiceController = require('../controllers/invoiceController');
router.get('/invoices/:bookingId', invoiceController.downloadInvoice);

const maintenanceController = require('../controllers/maintenanceController');
router.post('/maintenance', roleCheck(['admin', 'manager']), maintenanceController.scheduleMaintenance);
router.get('/maintenance', maintenanceController.listMaintenance);

const expenseController = require('../controllers/expenseController');
router.post('/expenses', roleCheck(['admin', 'manager']), expenseController.addExpense);
router.get('/expenses', expenseController.listExpenses);
router.get('/expenses/summary', expenseController.getFinancialSummary);

const staffController = require('../controllers/staffController');
router.get('/staff/users', staffController.listStaffUsers);
router.post('/shifts', roleCheck(['admin', 'manager']), staffController.createShift);
router.get('/shifts', staffController.listShifts);
router.post('/shifts/check-in', staffController.checkIn);
router.post('/shifts/check-out', staffController.checkOut);

const pricingController = require('../controllers/pricingController');
router.post('/pricing-rules', roleCheck(['admin', 'manager']), pricingController.createPricingRule);
router.get('/pricing-rules', pricingController.listPricingRules);

const analyticsController = require('../controllers/analyticsController');
router.get('/analytics', analyticsController.getAnalytics);

const couponController = require('../controllers/couponController');
router.post('/coupons', roleCheck(['admin', 'manager']), couponController.createCoupon);
router.get('/coupons', couponController.listCoupons);
router.post('/coupons/validate', couponController.validateCoupon); // Public-ish

module.exports = router;
