const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/locks', rateLimiter, apiKeyAuth, apiController.createLock);
router.delete('/locks/:lockId', rateLimiter, apiKeyAuth, apiController.releaseLock);

module.exports = router;
