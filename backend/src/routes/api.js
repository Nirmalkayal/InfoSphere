const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const slotController = require('../controllers/slotController');
const staffController = require('../controllers/staffController');

const tournamentController = require('../controllers/tournamentController'); // Need to create

const expenseController = require('../controllers/expenseController');
const maintenanceController = require('../controllers/maintenanceController');

// MOCK AUTH MIDDLEWARE (For Demo/Migration Compatibility)
// This ensures controllers accessing req.user don't crash
router.use(async (req, res, next) => {
    // Basic mock user
    req.user = {
        id: '65c27a29f8d9a8c123456789', // Placeholder ID
        turfId: '65c27a29f8d9a8c123456789',
        role: 'admin'
    };
    next();
});

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);

// Slots & Bookings
router.get('/slots', slotController.getSlots);
router.post('/slots/:slotId/lock', slotController.lockSlot);
router.post('/slots/book', slotController.bookSlot);

// Staff & Shifts
router.get('/staff', staffController.listStaffUsers);
router.get('/shifts', staffController.listShifts);
router.post('/shifts', staffController.createShift);

// Operations
router.get('/expenses', expenseController.listExpenses);
router.post('/expenses', expenseController.addExpense);
router.get('/shift-stats', expenseController.getShiftStats); // New
router.post('/shift-close', expenseController.closeShift); // New
router.get('/maintenance', maintenanceController.listMaintenance);
router.post('/maintenance', maintenanceController.scheduleMaintenance);

// Tournaments
router.get('/tournaments', tournamentController.getTournaments);
router.post('/tournaments', tournamentController.createTournament);


module.exports = router;
