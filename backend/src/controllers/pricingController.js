const PricingRule = require('../models/PricingRule');

exports.createPricingRule = async (req, res) => {
    try {
        const rule = await PricingRule.create({
            ...req.body,
            turf: req.user.turfId
        });
        res.json(rule);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

exports.listPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find({ turf: req.user.turfId });
        res.json(rules);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};
