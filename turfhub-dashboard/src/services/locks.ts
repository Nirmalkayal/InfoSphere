import adminApi from './api';

export interface Lock {
  id: string;
  slotId: string;
  turfId: string;
  groundId: string;
  groundName: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  apiKeyId: string;
  apiKeyLabel: string;
  lockedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'released' | 'converted';
  customerName?: string;
  customerPhone?: string;
}

export interface LockFilters {
  turfId?: string;
  groundId?: string;
  status?: Lock['status'];
  platform?: string;
  startDate?: string;
  endDate?: string;
}

export const lockService = {
  // Get all active locks
  getActiveLocks: async (filters?: LockFilters): Promise<Lock[]> => {
    const response = await adminApi.get('/locks', {
      params: { ...filters, status: 'active' },
    });
    return response.data;
  },

  // Get all locks (including expired)
  getAll: async (filters?: LockFilters): Promise<Lock[]> => {
    const response = await adminApi.get('/locks', { params: filters });
    return response.data;
  },

  // Get single lock by ID
  getById: async (id: string): Promise<Lock> => {
    const response = await adminApi.get(`/locks/${id}`);
    return response.data;
  },

  // Force unlock (admin action)
  forceUnlock: async (id: string, reason?: string): Promise<void> => {
    await adminApi.post(`/locks/${id}/force-unlock`, { reason });
  },

  // Force unlock multiple locks
  forceUnlockBulk: async (lockIds: string[], reason?: string): Promise<{ released: number }> => {
    const response = await adminApi.post('/locks/force-unlock-bulk', {
      lockIds,
      reason,
    });
    return response.data;
  },

  // Get lock statistics
  getStats: async (turfId?: string): Promise<{
    totalActive: number;
    byPlatform: { platform: string; count: number }[];
    avgLockDuration: number;
    conversionRate: number;
  }> => {
    const response = await adminApi.get('/locks/stats', {
      params: { turfId },
    });
    return response.data;
  },

  // Get lock history for a slot
  getSlotLockHistory: async (slotId: string): Promise<Lock[]> => {
    const response = await adminApi.get(`/locks/slot/${slotId}/history`);
    return response.data;
  },
};

export default lockService;
