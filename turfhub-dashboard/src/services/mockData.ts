import { addDays, format, startOfToday, subDays, subHours, subMinutes } from 'date-fns';

const today = startOfToday();

// --- 1. SLOTS ---
const generateSlots = () => {
    const slots = [];
    // Generate for Today +/- 10 days
    for (let i = -10; i <= 10; i++) {
        const day = addDays(today, i);
        // Morning Slots (6-8 AM)
        slots.push({
            id: `m-${i}-1`,
            start: new Date(day.setHours(6, 0)).toISOString(),
            end: new Date(day.setHours(7, 0)).toISOString(),
            status: 'booked',
            bookingId: `b-${i}-1`,
            groundName: 'Cricket Arena A',
            customerName: 'Morning Club',
            price: 800
        });
        slots.push({
            id: `m-${i}-2`,
            start: new Date(day.setHours(7, 0)).toISOString(),
            end: new Date(day.setHours(8, 0)).toISOString(),
            status: 'booked',
            bookingId: `b-${i}-2`,
            groundName: 'Football Turf 5s',
            customerName: 'Early Risers FC',
            price: 1000
        });

        // Mid-day Slots (Visible in default view 9-14)
        slots.push({
            id: `mid-${i}-1`,
            start: new Date(day.setHours(10, 0)).toISOString(),
            end: new Date(day.setHours(11, 0)).toISOString(),
            status: 'booked',
            bookingId: `b-${i}-mid1`,
            groundName: 'Cricket Arena A',
            customerName: 'Corporate Training',
            price: 1000
        });
        slots.push({
            id: `mid-${i}-2`,
            start: new Date(day.setHours(11, 0)).toISOString(),
            end: new Date(day.setHours(12, 0)).toISOString(),
            status: 'available',
            bookingId: `b-${i}-mid2`,
            groundName: 'Football Turf 5s',
            price: 1200
        });

        // Afternoon Slots (14-17)
        for (let h = 14; h < 17; h++) {
            if (Math.random() > 0.6) { // Randomly populate afternoon slots
                const isBooked = Math.random() > 0.5;
                slots.push({
                    id: `aft-${i}-${h}`,
                    start: new Date(day.setHours(h, 0)).toISOString(),
                    end: new Date(day.setHours(h + 1, 0)).toISOString(),
                    status: isBooked ? 'booked' : 'available',
                    bookingId: isBooked ? `b-${i}-aft${h}` : undefined,
                    groundName: 'Cricket Arena A',
                    customerName: isBooked ? 'Afternoon Practice' : undefined,
                    price: 900
                });
            }
        }

        // Evening Peak (6-10 PM)
        slots.push({
            id: `e-${i}-1`,
            start: new Date(day.setHours(18, 0)).toISOString(),
            end: new Date(day.setHours(19, 0)).toISOString(),
            status: 'booked',
            bookingId: `b-${i}-3`,
            groundName: 'Cricket Arena A',
            customerName: 'Corporate League',
            price: 1500
        });
        slots.push({
            id: `e-${i}-2`,
            start: new Date(day.setHours(19, 0)).toISOString(),
            end: new Date(day.setHours(20, 0)).toISOString(),
            status: 'booked',
            bookingId: `b-${i}-4`,
            groundName: 'Football Turf 5s',
            customerName: 'Super Strikers',
            price: 1800
        });

        // Some available slots
        slots.push({
            id: `a-${i}-1`,
            start: new Date(day.setHours(20, 0)).toISOString(),
            end: new Date(day.setHours(21, 0)).toISOString(),
            status: 'available',
            groundName: 'Cricket Arena A',
            price: 1500
        });
    }
    return slots;
};

export const MOCK_SLOTS = generateSlots();

// --- 2. ANALYTICS ---
export const MOCK_ANALYTICS = {
    stats: {
        revenue: 452000,
        expenses: 125000,
        profit: 327000,
        bookings: 342
    },
    revenueChart: [
        { _id: format(subDays(today, 6), 'yyyy-MM-dd'), revenue: 42000 },
        { _id: format(subDays(today, 5), 'yyyy-MM-dd'), revenue: 38000 },
        { _id: format(subDays(today, 4), 'yyyy-MM-dd'), revenue: 45000 },
        { _id: format(subDays(today, 3), 'yyyy-MM-dd'), revenue: 52000 },
        { _id: format(subDays(today, 2), 'yyyy-MM-dd'), revenue: 65000 },
        { _id: format(subDays(today, 1), 'yyyy-MM-dd'), revenue: 58000 },
        { _id: format(today, 'yyyy-MM-dd'), revenue: 22000 },
    ],
    peakHours: [
        { hour: 18, count: 85 },
        { hour: 19, count: 92 },
        { hour: 20, count: 78 },
        { hour: 7, count: 45 },
        { hour: 6, count: 35 },
        { hour: 21, count: 20 },
    ],
    platforms: [
        { name: 'App', value: 165 },
        { name: 'Walk-in', value: 45 },
        { name: 'Playo', value: 32 },
        { name: 'KheloMore', value: 15 },
    ]
};

// --- 3. MARKETING / COUPONS ---
export const MOCK_COUPONS = [
    { _id: 'c1', code: 'WELCOME50', discountType: 'percentage', discountValue: 50, minOrderValue: 500, expiryDate: addDays(today, 30).toISOString(), isActive: true, usedCount: 124 },
    { _id: 'c2', code: 'FLAT100', discountType: 'flat', discountValue: 100, minOrderValue: 1000, expiryDate: addDays(today, 15).toISOString(), isActive: true, usedCount: 89 },
    { _id: 'c3', code: 'WEEKEND20', discountType: 'percentage', discountValue: 20, minOrderValue: 1500, expiryDate: addDays(today, 60).toISOString(), isActive: true, usedCount: 45 },
];

// --- 4. OPERATIONS / EXPENSES ---
export const MOCK_EXPENSES = [
    { _id: 'ep0', category: 'Maintenance', description: 'Turf Re-grassing (Patch)', amount: 12000, date: format(today, 'yyyy-MM-dd') },
    { _id: 'ep1', category: 'Maintenance', description: 'Net Repair - Goal Post', amount: 2500, date: format(subDays(today, 1), 'yyyy-MM-dd') },
    { _id: 'ep2', category: 'Utilities', description: 'Electricity Bill - Nov', amount: 18500, date: format(subDays(today, 5), 'yyyy-MM-dd') },
    { _id: 'ep3', category: 'Staff', description: 'Staff Salaries', amount: 85000, date: format(subDays(today, 10), 'yyyy-MM-dd') },
    { _id: 'ep4', category: 'Inventory', description: 'Water Bottles Stock', amount: 1500, date: format(subDays(today, 2), 'yyyy-MM-dd') },
];

export const MOCK_MAINTENANCE = [
    { _id: 'mnt1', type: 'Wash', description: 'Deep Cleaning', cost: 500, startTime: new Date(today.setHours(14, 0)).toISOString(), endTime: new Date(today.setHours(15, 0)).toISOString(), status: 'scheduled' },
    { _id: 'mnt2', type: 'Repair', description: 'Fence Repair', cost: 1200, startTime: new Date(addDays(today, 1).setHours(10, 0)).toISOString(), endTime: new Date(addDays(today, 1).setHours(12, 0)).toISOString(), status: 'scheduled' },
];

// --- 5. STAFF / SHIFTS ---
export const MOCK_STAFF = [
    { id: 'u1', _id: 'u1', name: 'Ramesh Kumar', email: 'ramesh@turfhub.com', role: 'manager', status: 'active', avatar: '', lastActiveAt: subMinutes(new Date(), 5).toISOString() },
    { id: 'u2', _id: 'u2', name: 'Suresh Singh', email: 'suresh@turfhub.com', role: 'staff', status: 'active', avatar: '', lastActiveAt: subHours(new Date(), 1).toISOString() },
    { id: 'u3', _id: 'u3', name: 'Amit Patel', email: 'amit@turfhub.com', role: 'staff', status: 'pending', avatar: '' },
    { id: 'u4', _id: 'u4', name: 'Priya Sharma', email: 'priya@turfhub.com', role: 'admin', status: 'active', avatar: '', lastActiveAt: subMinutes(new Date(), 45).toISOString() },
    { id: 'u5', _id: 'u5', name: 'Deepak Verma', email: 'deepak@turfhub.com', role: 'staff', status: 'active', avatar: '', lastActiveAt: subDays(new Date(), 1).toISOString() },
    { id: 'u6', _id: 'u6', name: 'Anjali Gupta', email: 'anjali@turfhub.com', role: 'manager', status: 'active', avatar: '', lastActiveAt: subHours(new Date(), 2).toISOString() },
    { id: 'u7', _id: 'u7', name: 'Rahul Dravid', email: 'rahul@turfhub.com', role: 'admin', status: 'active', avatar: '', lastActiveAt: subMinutes(new Date(), 10).toISOString() },
    { id: 'u8', _id: 'u8', name: 'Sneha Reddy', email: 'sneha@turfhub.com', role: 'staff', status: 'pending', avatar: '' },
    { id: 'u9', _id: 'u9', name: 'Vikram Malhotra', email: 'vikram@turfhub.com', role: 'staff', status: 'active', avatar: '', lastActiveAt: subDays(new Date(), 3).toISOString() },
    { id: 'u10', _id: 'u10', name: 'Neha Kapoor', email: 'neha@turfhub.com', role: 'manager', status: 'active', avatar: '', lastActiveAt: subHours(new Date(), 4).toISOString() },
    { id: 'u11', _id: 'u11', name: 'Arjun Rampal', email: 'arjun@turfhub.com', role: 'staff', status: 'active', avatar: '', lastActiveAt: subMinutes(new Date(), 30).toISOString() },
    { id: 'u12', _id: 'u12', name: 'Kavita Krishnamurthy', email: 'kavita@turfhub.com', role: 'staff', status: 'pending', avatar: '' },
    { id: 'u13', _id: 'u13', name: 'Manoj Bajpayee', email: 'manoj@turfhub.com', role: 'admin', status: 'active', avatar: '', lastActiveAt: subDays(new Date(), 2).toISOString() },
    { id: 'u14', _id: 'u14', name: 'Farhan Akhtar', email: 'farhan@turfhub.com', role: 'manager', status: 'active', avatar: '', lastActiveAt: subHours(new Date(), 6).toISOString() },
    { id: 'u15', _id: 'u15', name: 'Shraddha Kapoor', email: 'shraddha@turfhub.com', role: 'staff', status: 'active', avatar: '', lastActiveAt: subMinutes(new Date(), 15).toISOString() },
];

export const MOCK_SHIFTS = [
    { _id: 's1', user: { _id: 'u1', name: 'Ramesh Kumar' }, start: new Date(today.setHours(9, 0)).toISOString(), end: new Date(today.setHours(18, 0)).toISOString(), status: 'present', checkIn: new Date(today.setHours(9, 5)).toISOString() },
    { _id: 's2', user: { _id: 'u2', name: 'Suresh Singh' }, start: new Date(today.setHours(14, 0)).toISOString(), end: new Date(today.setHours(22, 0)).toISOString(), status: 'scheduled' },
    { _id: 's3', user: { _id: 'u5', name: 'Deepak Verma' }, start: new Date(today.setHours(8, 0)).toISOString(), end: new Date(today.setHours(17, 0)).toISOString(), status: 'present', checkIn: new Date(today.setHours(7, 55)).toISOString() },
    { _id: 's4', user: { _id: 'u6', name: 'Anjali Gupta' }, start: new Date(today.setHours(10, 0)).toISOString(), end: new Date(today.setHours(19, 0)).toISOString(), status: 'scheduled' },
    { _id: 's5', user: { _id: 'u9', name: 'Vikram Malhotra' }, start: new Date(today.setHours(12, 0)).toISOString(), end: new Date(today.setHours(21, 0)).toISOString(), status: 'scheduled' },
    { _id: 's6', user: { _id: 'u10', name: 'Neha Kapoor' }, start: new Date(today.setHours(9, 0)).toISOString(), end: new Date(today.setHours(18, 0)).toISOString(), status: 'present', checkIn: new Date(today.setHours(9, 10)).toISOString() },
    { _id: 's7', user: { _id: 'u11', name: 'Arjun Rampal' }, start: new Date(today.setHours(6, 0)).toISOString(), end: new Date(today.setHours(15, 0)).toISOString(), status: 'present', checkIn: new Date(today.setHours(6, 0)).toISOString(), checkOut: new Date(today.setHours(15, 5)).toISOString() },
    { _id: 's8', user: { _id: 'u14', name: 'Farhan Akhtar' }, start: new Date(today.setHours(13, 0)).toISOString(), end: new Date(today.setHours(22, 0)).toISOString(), status: 'scheduled' },
    { _id: 's9', user: { _id: 'u15', name: 'Shraddha Kapoor' }, start: new Date(today.setHours(7, 0)).toISOString(), end: new Date(today.setHours(16, 0)).toISOString(), status: 'present', checkIn: new Date(today.setHours(7, 2)).toISOString() },
    { _id: 's10', user: { _id: 'u1', name: 'Ramesh Kumar' }, start: new Date(subDays(today, 1).setHours(9, 0)).toISOString(), end: new Date(subDays(today, 1).setHours(18, 0)).toISOString(), status: 'present', checkIn: new Date(subDays(today, 1).setHours(8, 55)).toISOString(), checkOut: new Date(subDays(today, 1).setHours(18, 5)).toISOString() },
    { _id: 's11', user: { _id: 'u2', name: 'Suresh Singh' }, start: new Date(subDays(today, 1).setHours(14, 0)).toISOString(), end: new Date(subDays(today, 1).setHours(22, 0)).toISOString(), status: 'present', checkIn: new Date(subDays(today, 1).setHours(14, 0)).toISOString(), checkOut: new Date(subDays(today, 1).setHours(22, 0)).toISOString() },
    { _id: 's12', user: { _id: 'u5', name: 'Deepak Verma' }, start: new Date(addDays(today, 1).setHours(8, 0)).toISOString(), end: new Date(addDays(today, 1).setHours(17, 0)).toISOString(), status: 'scheduled' },
    { _id: 's13', user: { _id: 'u6', name: 'Anjali Gupta' }, start: new Date(addDays(today, 1).setHours(10, 0)).toISOString(), end: new Date(addDays(today, 1).setHours(19, 0)).toISOString(), status: 'scheduled' },
    { _id: 's14', user: { _id: 'u9', name: 'Vikram Malhotra' }, start: new Date(addDays(today, 1).setHours(12, 0)).toISOString(), end: new Date(addDays(today, 1).setHours(21, 0)).toISOString(), status: 'scheduled' },
    { _id: 's15', user: { _id: 'u10', name: 'Neha Kapoor' }, start: new Date(addDays(today, 1).setHours(9, 0)).toISOString(), end: new Date(addDays(today, 1).setHours(18, 0)).toISOString(), status: 'scheduled' },
];

// --- 6. DYNAMIC PRICING ---
export const MOCK_PRICING_RULES = [
    { _id: 'pr1', name: 'Weekend Surge', dayOfWeek: [0, 6], startTime: '18:00', endTime: '23:00', adjustmentType: 'percentage', adjustmentValue: 20, isActive: true },
    { _id: 'pr2', name: 'Morning Discount', dayOfWeek: [1, 2, 3, 4, 5], startTime: '06:00', endTime: '09:00', adjustmentType: 'flat', adjustmentValue: -100, isActive: true },
    { _id: 'pr3', name: 'Late Night Pass', dayOfWeek: [5, 6], startTime: '23:00', endTime: '02:00', adjustmentType: 'percentage', adjustmentValue: 10, isActive: false },
];

// --- 7. TURFS ---
export const MOCK_TURFS = [
    { id: 't1', name: 'Central Arena', location: 'Koramangala, Bangalore', grounds: 3, availableSlots: 145, integrations: 3, status: 'active' },
    { id: 't2', name: 'North Box Cricket', location: 'Indiranagar, Bangalore', grounds: 2, availableSlots: 84, integrations: 1, status: 'active' },
    { id: 't3', name: 'South Football Fields', location: 'Jayanagar, Bangalore', grounds: 4, availableSlots: 120, integrations: 2, status: 'inactive' },
    { id: 't4', name: 'Premier Cricket Ground', location: 'Whitefield, Bangalore', grounds: 1, availableSlots: 20, integrations: 1, status: 'active' },
    { id: 't5', name: 'Smash Badminton Center', location: 'HSR Layout, Bangalore', grounds: 4, availableSlots: 160, integrations: 4, status: 'active' },
];

// --- 8. API KEYS ---
export const MOCK_API_KEYS = [
    { id: 'k1', key: 'sk_live_51Mz...', platform: 'Sportify', status: 'active', lastUsedAt: subMinutes(new Date(), 2).toISOString(), rateLimitPerHour: 1000, createdAt: subDays(new Date(), 90).toISOString() },
    { id: 'k2', key: 'sk_test_42Kj...', platform: 'Playo', status: 'active', lastUsedAt: subMinutes(new Date(), 15).toISOString(), rateLimitPerHour: 2000, createdAt: subDays(new Date(), 60).toISOString() },
    { id: 'k3', key: 'sk_test_98Xy...', platform: 'Internal App', status: 'active', lastUsedAt: subHours(new Date(), 4).toISOString(), rateLimitPerHour: 5000, createdAt: subDays(new Date(), 120).toISOString() },
    { id: 'k4', key: 'sk_old_11Ab...', platform: 'Legacy System', status: 'expired', lastUsedAt: subDays(new Date(), 45).toISOString(), rateLimitPerHour: 100, createdAt: subDays(new Date(), 365).toISOString() },
    { id: 'k5', key: 'sk_live_77Rt...', platform: 'KheloMore', status: 'active', lastUsedAt: subHours(new Date(), 1).toISOString(), rateLimitPerHour: 1500, createdAt: subDays(new Date(), 30).toISOString() },
    { id: 'k6', key: 'sk_test_33Bn...', platform: 'Website Widget', status: 'active', lastUsedAt: subMinutes(new Date(), 5).toISOString(), rateLimitPerHour: 10000, createdAt: subDays(new Date(), 10).toISOString() },
    { id: 'k7', key: 'sk_live_99Op...', platform: 'Partner: GymFit', status: 'active', lastUsedAt: subDays(new Date(), 1).toISOString(), rateLimitPerHour: 500, createdAt: subDays(new Date(), 150).toISOString() },
    { id: 'k8', key: 'sk_old_22Zx...', platform: 'Mobile App v1', status: 'expired', lastUsedAt: subDays(new Date(), 180).toISOString(), rateLimitPerHour: 1000, createdAt: subDays(new Date(), 400).toISOString() },
    { id: 'k9', key: 'sk_live_44Qe...', platform: 'Corporate Portal', status: 'active', lastUsedAt: subHours(new Date(), 12).toISOString(), rateLimitPerHour: 2000, createdAt: subDays(new Date(), 45).toISOString() },
    { id: 'k10', key: 'sk_test_11Vm...', platform: 'Dev Testing', status: 'active', lastUsedAt: subMinutes(new Date(), 30).toISOString(), rateLimitPerHour: 100, createdAt: subDays(new Date(), 5).toISOString() },
];

// --- 9. LOGS ---
export const MOCK_LOGS = Array.from({ length: 50 }).map((_, i) => ({
    id: `log-${i}`,
    timestamp: format(subMinutes(new Date(), i * 5), 'yyyy-MM-dd HH:mm:ss'),
    platform: i % 3 === 0 ? 'Sportify' : i % 3 === 1 ? 'Playo' : 'Internal',
    endpoint: i % 4 === 0 ? '/slots/book' : i % 4 === 1 ? '/slots/check' : '/webhooks/payment',
    method: i % 4 === 0 ? 'POST' : 'GET',
    status: i % 10 === 0 ? 'failed' : 'success', // 10% failure rate
    responseTimeMs: Math.floor(Math.random() * 200) + 50,
    dataRequested: i % 4 === 0 ? '{ "slotId": "123" }' : 'query: { date: "today" }'
}));

// --- TOURNAMENTS (Phase 10) ---

export const MOCK_TOURNAMENTS = [
    {
        id: 't1',
        name: 'Winter Cup 2024',
        type: 'KNOCKOUT',
        startDate: '2023-12-20',
        endDate: '2023-12-22',
        prizePool: 25000,
        entryFee: 1500,
        status: 'UPCOMING',
        maxTeams: 8,
        registeredTeams: 8
    }
];

export const MOCK_TEAMS = [
    { id: 'tm1', name: 'Spartans FC', captain: 'Rahul', tournamentId: 't1' },
    { id: 'tm2', name: 'Turf Kings', captain: 'Amit', tournamentId: 't1' },
    { id: 'tm3', name: 'Night Owls', captain: 'Vikram', tournamentId: 't1' },
    { id: 'tm4', name: 'Thunderbolts', captain: 'Rohit', tournamentId: 't1' },
    { id: 'tm5', name: 'Red Devils', captain: 'Karan', tournamentId: 't1' },
    { id: 'tm6', name: 'Blue Waves', captain: 'Arjun', tournamentId: 't1' },
    { id: 'tm7', name: 'Goal Diggers', captain: 'Sameer', tournamentId: 't1' },
    { id: 'tm8', name: 'Invincibles', captain: 'Mohit', tournamentId: 't1' }
];

export const MOCK_MATCHES = [
    // Quarter Finals (Round 1)
    { id: 'm1', tournamentId: 't1', round: 1, team1: 'tm1', team2: 'tm2', score1: null, score2: null, winner: null, status: 'SCHEDULED', nextMatchId: 'm5' },
    { id: 'm2', tournamentId: 't1', round: 1, team1: 'tm3', team2: 'tm4', score1: null, score2: null, winner: null, status: 'SCHEDULED', nextMatchId: 'm5' },
    { id: 'm3', tournamentId: 't1', round: 1, team1: 'tm5', team2: 'tm6', score1: null, score2: null, winner: null, status: 'SCHEDULED', nextMatchId: 'm6' },
    { id: 'm4', tournamentId: 't1', round: 1, team1: 'tm7', team2: 'tm8', score1: null, score2: null, winner: null, status: 'SCHEDULED', nextMatchId: 'm6' },

    // Semi Finals (Round 2)
    { id: 'm5', tournamentId: 't1', round: 2, team1: null, team2: null, score1: null, score2: null, winner: null, status: 'PENDING', nextMatchId: 'm7' },
    { id: 'm6', tournamentId: 't1', round: 2, team1: null, team2: null, score1: null, score2: null, winner: null, status: 'PENDING', nextMatchId: 'm7' },

    // Final (Round 3)
    { id: 'm7', tournamentId: 't1', round: 3, team1: null, team2: null, score1: null, score2: null, winner: null, status: 'PENDING', nextMatchId: null }
];

export const MOCK_PLAYERS = [
    // Spartans FC (tm1)
    { id: 'p1', name: 'Rahul Sharma', teamId: 'tm1', number: 10, position: 'Forward' },
    { id: 'p2', name: 'Vikram Singh', teamId: 'tm1', number: 7, position: 'Midfielder' },
    { id: 'p3', name: 'Aditya Raj', teamId: 'tm1', number: 1, position: 'Goalkeeper' },
    // Turf Kings (tm2)
    { id: 'p4', name: 'Amit Kumar', teamId: 'tm2', number: 9, position: 'Forward' },
    { id: 'p5', name: 'Suresh Raina', teamId: 'tm2', number: 5, position: 'Defender' },
    // Night Owls (tm3)
    { id: 'p6', name: 'Vikram Vedha', teamId: 'tm3', number: 11, position: 'Forward' }
];

export const MOCK_REFEREES = [
    { id: 'r1', name: 'Simon Taufel', certification: 'ICC Elite', matches: 120, rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=r1' },
    { id: 'r2', name: 'Pierluigi Collina', certification: 'FIFA Elite', matches: 350, rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=r2' },
    { id: 'r3', name: 'Michael Oliver', certification: 'FA Pro', matches: 85, rating: 4.2, avatar: 'https://i.pravatar.cc/150?u=r3' },
    { id: 'r4', name: 'Nitin Menon', certification: 'BCCI Grade A', matches: 45, rating: 4.5, avatar: 'https://i.pravatar.cc/150?u=r4' }
];

export const MOCK_BATCHES = [
    { id: 'b1', name: 'U-14 Football Academy', days: ['Mon', 'Wed', 'Fri'], startTime: '16:00', endTime: '18:00', price: 1500, students: 12, maxStudents: 20, sport: 'Football', color: 'bg-green-100 text-green-700' },
    { id: 'b2', name: 'Evening Cricket Nets', days: ['Tue', 'Thu', 'Sat'], startTime: '18:00', endTime: '20:00', price: 2000, students: 8, maxStudents: 15, sport: 'Cricket', color: 'bg-blue-100 text-blue-700' },
    { id: 'b3', name: 'Badminton Monthly Membership', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '06:00', endTime: '07:00', price: 1200, students: 4, maxStudents: 4, sport: 'Badminton', color: 'bg-orange-100 text-orange-700' }
];

export const MOCK_STUDENTS = [
    { id: 's1', name: 'Rahul Sharma', batchId: 'b1', contact: '9876543210', status: 'PAID', joinDate: '2023-01-15', renewalDate: '2025-01-15', paidAmount: 1500 },
    { id: 's2', name: 'Kiran Patel', batchId: 'b1', contact: '9876543211', status: 'DUE', joinDate: '2023-02-10', renewalDate: '2024-12-10', paidAmount: 0 },
    { id: 's3', name: 'Aakash Singh', batchId: 'b2', contact: '9876543212', status: 'EXPIRED', joinDate: '2023-03-05', renewalDate: '2023-10-05', paidAmount: 0 },
    { id: 's4', name: 'Sania Nehwal', batchId: 'b3', contact: '9876543213', status: 'PAID', joinDate: '2023-06-01', renewalDate: '2024-12-30', paidAmount: 1200 },
    { id: 's5', name: 'Pullela G', batchId: 'b3', contact: '9876543214', status: 'DUE', joinDate: '2023-06-01', renewalDate: '2024-12-05', paidAmount: 0 }
];
