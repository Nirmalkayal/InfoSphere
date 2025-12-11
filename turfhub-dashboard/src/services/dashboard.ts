import adminApi from './api';

export interface DashboardStats {
  totalApiCalls: number;
  apiCallsChange: number; // percentage change from last period
  activeIntegrations: number;
  integrationsChange: number;
  registeredGrounds: number;
  groundsChange: number;
  failedRequests: number;
  failedRequestsChange: number;
  slotsAddedToday: number;
  totalRevenue: number;
  revenueChange: number;
}

export interface PlatformSession {
  platform: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyOverview {
  apiCallsToday: number;
  successfulRequests: number;
  failedRequests: number;
  newIntegrations: number;
  bookingsToday: number;
  revenueToday: number;
}

export interface PerformanceData {
  date: string;
  apiCalls: number;
  bookings: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'api_call' | 'lock' | 'unlock' | 'webhook';
  description: string;
  platform?: string;
  timestamp: string;
}

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (turfId?: string): Promise<DashboardStats> => {
    const response = await adminApi.get('/dashboard/stats', { params: { turfId } });
    return response.data;
  },

  // Get platform session breakdown
  getPlatformSessions: async (turfId?: string): Promise<PlatformSession[]> => {
    const response = await adminApi.get('/dashboard/sessions', { params: { turfId } });
    return response.data;
  },

  // Get daily overview
  getDailyOverview: async (turfId?: string): Promise<DailyOverview> => {
    const response = await adminApi.get('/dashboard/daily', { params: { turfId } });
    return response.data;
  },

  // Get performance chart data
  getPerformanceData: async (
    period: 'week' | 'month' | 'year' = 'week',
    turfId?: string
  ): Promise<PerformanceData[]> => {
    const response = await adminApi.get('/dashboard/performance', {
      params: { period, turfId },
    });
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (turfId?: string, limit = 10): Promise<RecentActivity[]> => {
    const response = await adminApi.get('/dashboard/activity', {
      params: { turfId, limit },
    });
    return response.data;
  },

  // Get slot visibility stats
  getSlotVisibility: async (turfId?: string): Promise<{
    totalSlots: number;
    visibleOnPlatforms: number;
    bookedSlots: number;
    availableSlots: number;
    blockedSlots: number;
  }> => {
    const response = await adminApi.get('/dashboard/visibility', { params: { turfId } });
    return response.data;
  },
};

export default dashboardService;
