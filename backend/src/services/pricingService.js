const PricingRule = require('../models/PricingRule');
const Turf = require('../models/Turf');

async function calculatePrice(turfId, slotStartTime) {
    // 1. Get Base Price
    const turf = await Turf.findById(turfId);
    let finalPrice = turf?.basePrice || 500;

    // 2. Get Rules
    const date = new Date(slotStartTime);
    const day = date.getDay(); // 0-6
    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Convert slot time to minutes from midnight for comparison
    const slotTimeMinutes = hour * 60 + minutes;

    const rules = await PricingRule.find({ turf: turfId, isActive: true });

    // 3. Apply Rules
    for (const rule of rules) {
        if (rule.dayOfWeek.includes(day)) {
            const [startH, startM] = rule.startTime.split(':').map(Number);
            const [endH, endM] = rule.endTime.split(':').map(Number);

            const ruleStart = startH * 60 + startM;
            const ruleEnd = endH * 60 + endM;

            // Check overlap
            if (slotTimeMinutes >= ruleStart && slotTimeMinutes < ruleEnd) {
                if (rule.adjustmentType === 'flat') {
                    finalPrice = rule.adjustmentValue; // Override
                } else if (rule.adjustmentType === 'percentage') {
                    // Increase by X%
                    finalPrice += (finalPrice * (rule.adjustmentValue / 100));
                }
            }
        }
    }

    return Math.round(finalPrice);
}

module.exports = { calculatePrice };
