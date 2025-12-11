export interface PriceBreakdown {
    basePrice: number;
    finalPrice: number;
    modifiers: {
        name: string;
        amount: number;
        type: 'surge' | 'discount';
    }[];
}

export const PricingEngine = {
    calculatePrice: (date: Date, basePrice: number = 1000): PriceBreakdown => {
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday

        let currentPrice = basePrice;
        const modifiers: PriceBreakdown['modifiers'] = [];

        // 1. Weekend Surge (Sat/Sun)
        if (day === 0 || day === 6) {
            const surge = basePrice * 0.2; // 20%
            currentPrice += surge;
            modifiers.push({ name: 'Weekend Surge', amount: surge, type: 'surge' });
        }

        // 2. Evening Peak (6 PM - 10 PM)
        if (hour >= 18 && hour <= 22) {
            const peak = basePrice * 0.5; // 50%
            currentPrice += peak;
            modifiers.push({ name: 'Evening Peak', amount: peak, type: 'surge' });
        }

        // 3. Morning Peak (6 AM - 8 AM)
        if (hour >= 6 && hour <= 8) {
            const peak = basePrice * 0.1; // 10%
            currentPrice += peak;
            modifiers.push({ name: 'Morning Rush', amount: peak, type: 'surge' });
        }

        // 4. Dead Hours (12 PM - 4 PM)
        if (hour >= 12 && hour <= 16) {
            const discount = basePrice * 0.2; // 20% discount
            currentPrice -= discount;
            modifiers.push({ name: 'Happy Hour', amount: -discount, type: 'discount' });
        }

        return {
            basePrice,
            finalPrice: Math.round(currentPrice),
            modifiers
        };
    }
};
