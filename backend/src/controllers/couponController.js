const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create({
            ...req.body,
            turf: req.user.turfId
        });
        res.json(coupon);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create coupon' });
    }
};

exports.listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ turf: req.user.turfId }).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list coupons' });
    }
};

exports.validateCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        const turfId = req.user?.turfId || '65c27a29f8d9a8c123456789'; // Default for demo

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            turf: turfId,
            isActive: true
        });

        if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid code' });

        // Check Expiry
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ valid: false, message: 'Coupon expired' });
        }

        // Check Usage
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ valid: false, message: 'Usage limit exceeded' });
        }

        // Check Min Order
        if (amount < coupon.minOrderValue) {
            return res.status(400).json({ valid: false, message: `Min order value is ₹${coupon.minOrderValue}` });
        }

        // Calculate Discount
        let discount = 0;
        if (coupon.discountType === 'flat') {
            discount = coupon.discountValue;
        } else {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        }

        // Final Sanity
        if (discount > amount) discount = amount;

        res.json({
            valid: true,
            discount,
            finalAmount: amount - discount,
            couponCode: coupon.code,
            message: 'Coupon applied!'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Validation failed' });
    }
};
