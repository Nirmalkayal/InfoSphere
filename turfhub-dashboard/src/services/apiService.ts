/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// Base URL - change if needed
const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const ApiService = {
    // --- DASHBOARD ---
    getDashboardStats: async () => {
        const res = await api.get('/dashboard');
        return res.data; // { stats, revenueChart, peakHours }
    },

    // --- SLOTS ---
    getSlots: async (from?: string, to?: string) => {
        const params: any = {};
        if (from) params.from = from;
        if (to) params.to = to;
        const res = await api.get('/slots', { params });
        return res.data;
    },

    lockSlot: async (slotId: string, platform: string) => {
        const res = await api.post(`/slots/${slotId}/lock`, { platform });
        return res.data;
    },

    confirmBooking: async (slotId: string, customerName: string, amount: number, platform: string = 'internal') => {
        const res = await api.post('/slots/book', { slotId, customerName, amount, platform });
        return res.data;
    },

    // --- GENERIC ---
    // Helpers to keep TS happy if replacing MockService directly
    getAnalytics: async () => {
        const res = await api.get('/dashboard');
        return res.data;
    },

    // Add other methods as they are implemented in backend
    // For now, fallback to mock data or empty for missing endpoints to prevent crash
    // --- STAFF ---
    getStaff: async () => {
        const res = await api.get('/staff');
        return res.data;
    },
    getShifts: async () => {
        const res = await api.get('/shifts');
        return res.data;
    },
    createShift: async (shiftData: any) => {
        const res = await api.post('/shifts', shiftData);
        return res.data;
    },

    getCurrentShiftStats: async () => {
        const res = await api.get('/shift-stats');
        return res.data;
    },
    closeShift: async (cashInHand: number, notes: string) => {
        const res = await api.post('/shift-close', { cashInHand, notes });
        return res.data;
    },

    // --- OPERATIONS ---
    getExpenses: async () => {
        const res = await api.get('/expenses');
        return res.data;
    },
    getMaintenance: async () => {
        const res = await api.get('/maintenance');
        return res.data;
    },

    // --- TOURNAMENTS ---
    getTournaments: async () => {
        const res = await api.get('/tournaments');
        return res.data;
    },

    // --- OTHERS (Fallbacks) ---
    getTeams: (tournamentId?: string) => Promise.resolve([]),
    getMatches: (tournamentId?: string) => Promise.resolve([]),
    getPlayers: () => Promise.resolve([]),
    getCoupons: () => Promise.resolve([]),
    getPricingRules: () => Promise.resolve([]),
    getTurfs: () => Promise.resolve([]),
    getApiKeys: () => Promise.resolve([]),
    getLogs: () => Promise.resolve([])
};
