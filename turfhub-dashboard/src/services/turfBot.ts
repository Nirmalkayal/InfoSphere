import { ApiService } from "./apiService";
import { format } from "date-fns";

export interface BotResponse {
    text: string;
    data?: any;
    type: 'text' | 'stats' | 'chart' | 'list';
}

export const TurfBotService = {
    processQuery: async (query: string): Promise<BotResponse> => {
        const lower = query.toLowerCase();

        // Simulate thinking delay
        await new Promise(r => setTimeout(r, 600));

        // --- 1. GREETINGS & SMALL TALK ---
        if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
            return {
                text: "Hello there! 👋 I'm your TurfHub Assistant. I can help you with Revenue, Bookings, Staff, Tournaments, and more. What would you like to know?",
                type: 'text'
            };
        }

        // --- 2. CUSTOMERS (Best Customer) ---
        // prioritized before "Who" (Staff) to avoid overlap
        if (lower.includes('customer') || (lower.includes('who') && lower.includes('best'))) {
            const data = await ApiService.getDashboardStats();
            const best = data.topCustomer;

            if (best) {
                return {
                    text: `Your star customer is **${best._id}**! 🌟\nThey have spent ₹${best.totalSpent.toLocaleString()} across ${best.bookings} bookings.`,
                    type: 'stats',
                    data: { label: 'Top Customer', value: best._id }
                };
            } else {
                return {
                    text: "I couldn't find a top customer yet. Once you have more bookings, I'll identify them for you!",
                    type: 'text'
                };
            }
        }

        // --- 3. TOURNAMENTS ---
        if (lower.includes('tournament') || lower.includes('league') || lower.includes('cup') || lower.includes('match')) {
            const tournaments: any[] = await ApiService.getTournaments();
            const active = tournaments.filter(t => t.status === 'ONGOING' || t.status === 'UPCOMING');

            if (active.length > 0) {
                const names = active.map(t => t.name).join(', ');
                return {
                    text: `You have ${active.length} active tournaments: ${names}. Check the Tournaments page for brackets and scores! 🏆`,
                    type: 'list',
                    data: active
                };
            }
            return {
                text: "No active tournaments at the moment. You can create one in the Tournaments tab!",
                type: 'text'
            };
        }

        // --- 4. FINANCIALS (Profit, Revenue, Expenses) ---
        if (lower.includes('profit') || lower.includes('earning') || lower.includes('margin') || lower.includes('net')) {
            const data = await ApiService.getDashboardStats();
            const value = data.stats.profit;
            const emoji = value > 0 ? '📈' : '📉';

            return {
                text: `Your Total Net Profit is ₹${value.toLocaleString()} ${emoji}.\n(Revenue: ₹${data.stats.revenue.toLocaleString()} - Expenses: ₹${data.stats.expenses.toLocaleString()})`,
                type: 'stats',
                data: { label: 'Net Profit', value: `₹${value.toLocaleString()}` }
            };
        }

        if (lower.includes('revenue') || lower.includes('sales') || lower.includes('income') || lower.includes('money')) {
            const data = await ApiService.getDashboardStats();
            const value = data.stats.revenue;

            return {
                text: `💰 Total Revenue to date is **₹${value.toLocaleString()}**.\nBusiness is looking good!`,
                type: 'stats',
                data: { label: 'Total Revenue', value: `₹${value.toLocaleString()}` }
            };
        }

        if (lower.includes('expense') || lower.includes('cost') || lower.includes('spend')) {
            const expenses = await ApiService.getExpenses();
            const total = expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);
            return {
                text: `Total recorded expenses are ₹${total.toLocaleString()}. Keep an eye on Maintenance costs!`,
                type: 'stats',
                data: { label: 'Total Expenses', value: `₹${total.toLocaleString()}` }
            };
        }

        // --- 5. STAFF & OPS ---
        if (lower.includes('staff') || lower.includes('working') || lower.includes('shift') || lower.includes('manager')) {
            // "Who is working?"
            if (lower.includes('working') || lower.includes('now') || lower.includes('today')) {
                const shifts = await ApiService.getShifts();
                const active = shifts.filter((s: any) => s.status === 'present');
                const names = active.map((s: any) => s.user.name).join(', ');
                return {
                    text: active.length > 0
                        ? `👷 Currently on duty: ${names}.`
                        : "No staff currently checked in via the system.",
                    type: 'list',
                    data: active
                };
            }

            const staff = await ApiService.getStaff();
            return {
                text: `You have ${staff.length} staff members registered in the system. Manage them in the Staff tab.`,
                type: 'stats',
                data: { label: 'Total Staff', value: staff.length }
            };
        }

        // --- 6. MAINTENANCE ---
        if (lower.includes('maintenance') || lower.includes('broken') || lower.includes('repair') || lower.includes('issue') || lower.includes('fix')) {
            const issues = await ApiService.getMaintenance();

            if (issues.length > 0) {
                const desc = issues.map((i: any) => `${i.description} (${i.type})`).join(', ');
                return {
                    text: `⚠️ Alert: I found ${issues.length} maintenance records: ${desc}. Please resolve them soon!`,
                    type: 'list',
                    data: issues
                };
            }
            return { text: "✅ All good! No active maintenance issues found. Facility is 100% operational.", type: 'text' };
        }

        // --- 7. SLOTS & AVAILABILITY ---
        if (lower.includes('slot') || lower.includes('free') || lower.includes('available') || lower.includes('book') || lower.includes('open')) {
            const slots = await ApiService.getSlots();
            const freeSlots = Array.isArray(slots) ? slots.filter((s: any) => s.status === 'AVAILABLE' || s.status === 'available') : [];

            // Time query?
            if (lower.match(/\d+(:00)? ?(pm|am)/)) {
                return {
                    text: `I'll check that specfic time... (Checking availability for specific times is coming soon!). For now, I see ${freeSlots.length} total open slots.`,
                    type: 'text'
                };
            }

            return {
                text: `📅 I found **${freeSlots.length} available slots** for the current view. You can book them in the Calendar tab.`,
                type: 'stats',
                data: { label: 'Available Slots', value: freeSlots.length }
            };
        }

        // --- 8. BOOKINGS ---
        if (lower.includes('booking') || lower.includes('count')) {
            const data = await ApiService.getDashboardStats();
            return {
                text: `Total Bookings so far: **${data.stats.bookings}**. 🎟️`,
                type: 'stats',
                data: { label: 'Total Bookings', value: data.stats.bookings }
            };
        }

        // --- 9. DEFAULT SNAPSHOT ---
        const data = await ApiService.getDashboardStats();
        return {
            text: `🤖 **TurfHub Facility Snapshot**\n\n• 💰 Revenue: ₹${data.stats.revenue.toLocaleString()}\n• 🎟️ Bookings: ${data.stats.bookings}\n• 🏆 Top Customer: ${data.topCustomer ? data.topCustomer._id : 'N/A'}\n\nI can tell you about **Profit**, **Staff**, **Tournaments**, or **Maintenance**. Just ask!`,
            type: 'stats',
            data: { label: 'Current Revenue', value: `₹${data.stats.revenue.toLocaleString()}` }
        };
    }
};
