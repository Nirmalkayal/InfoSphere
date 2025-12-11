const mongoose = require('mongoose');

const tenantIsolation = (req, res, next) => {
    // 1. Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // 2. Super Admins bypass tenant checks (optional, but good for platform owners)
    if (req.user.role === 'admin' && !req.user.turfId) {
        return next();
    }

    // 3. Ensure User has a Turf ID
    if (!req.user.turfId) {
        return res.status(403).json({ message: 'Access Denied: User is not linked to any Turf.' });
    }

    // 4. Scope the Request
    // This attaches the turfId to the request object so controllers can use it easily
    req.turfId = req.user.turfId;

    // 5. (Advanced) If the request has a :turfId param, ensure it matches!
    const paramTurfId = req.params.turfId || req.body.turfId || req.query.turfId;

    if (paramTurfId && paramTurfId.toString() !== req.turfId.toString()) {
        return res.status(403).json({
            message: 'Security Alert: You are trying to access data from another Turf!',
            expected: req.turfId,
            attempted: paramTurfId
        });
    }

    next();
};

module.exports = tenantIsolation;
