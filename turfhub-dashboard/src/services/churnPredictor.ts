
export interface ChurnAnalysis {
    riskLevel: 'high' | 'medium' | 'low';
    riskScore: number; // 0-100, 100 is highest risk
    lastBookingDays: number;
    recommendedAction: {
        type: 'whatsapp' | 'email' | 'none';
        label: string;
        message: string;
    };
}

export const ChurnPredictor = {
    analyze: (lastBookingDate?: string): ChurnAnalysis => {
        if (!lastBookingDate) {
            return {
                riskLevel: 'high',
                riskScore: 100,
                lastBookingDays: -1, // Never booked
                recommendedAction: {
                    type: 'whatsapp',
                    label: 'First Booking Offer',
                    message: "Hey! We noticed you haven't played with us yet. Here is 50% off your first game!"
                }
            };
        }

        const last = new Date(lastBookingDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            return {
                riskLevel: 'high',
                riskScore: 90,
                lastBookingDays: diffDays,
                recommendedAction: {
                    type: 'whatsapp',
                    label: 'Win-Back Offer',
                    message: `We miss you! It's been ${diffDays} days. Come back for 20% off this weekend!`
                }
            };
        } else if (diffDays > 14) {
            return {
                riskLevel: 'medium',
                riskScore: 50,
                lastBookingDays: diffDays,
                recommendedAction: {
                    type: 'whatsapp',
                    label: 'Nudge',
                    message: "Ready for your next match? Slots are filling up fast!"
                }
            };
        } else {
            return {
                riskLevel: 'low',
                riskScore: 10,
                lastBookingDays: diffDays,
                recommendedAction: {
                    type: 'none',
                    label: 'Loyalty Reward',
                    message: "Thanks for being a regular!"
                }
            };
        }
    }
};
