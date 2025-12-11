import adminApi from './api';

export interface Slot {
  id: string;
  turfId: string;
  groundId: string;
  groundName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'locked' | 'blocked' | 'maintenance';
  platform?: string; // 'SportifyPro', 'Playo', 'Internal', etc.
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingId?: string;
  apiKeyLabel?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlotData {
  turfId: string;
  groundId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface GenerateSlotsData {
  turfId: string;
  groundId: string;
  startDate: string;
  endDate: string;
  slotDuration: number; // in minutes
  startHour: number; // 0-23
  endHour: number; // 0-23
  pricePerSlot: number;
  excludeDays?: number[]; // 0 = Sunday, 6 = Saturday
}

export interface SlotFilters {
  turfId?: string;
  groundId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: Slot['status'];
  platform?: string;
}

export const slotService = {
  // Get all slots with filters
  getAll: async (filters?: SlotFilters): Promise<Slot[]> => {
    const response = await adminApi.get('/slots', { params: filters });
    return response.data;
  },

  // Get slots for a specific date range
  getByDateRange: async (turfId: string, startDate: string, endDate: string): Promise<Slot[]> => {
    const response = await adminApi.get('/slots', {
      params: { turfId, startDate, endDate },
    });
    return response.data;
  },

  // Get single slot by ID
  getById: async (id: string): Promise<Slot> => {
    const response = await adminApi.get(`/slots/${id}`);
    return response.data;
  },

  // Create single slot
  create: async (data: CreateSlotData): Promise<Slot> => {
    const response = await adminApi.post('/slots', data);
    return response.data;
  },

  // Generate multiple slots
  generateSlots: async (data: GenerateSlotsData): Promise<{ created: number; slots: Slot[] }> => {
    const response = await adminApi.post('/slots/generate', data);
    return response.data;
  },

  // Update slot
  update: async (id: string, data: Partial<Slot>): Promise<Slot> => {
    const response = await adminApi.put(`/slots/${id}`, data);
    return response.data;
  },

  // Delete slot
  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/slots/${id}`);
  },

  // Block slot (for maintenance, etc.)
  blockSlot: async (id: string, reason?: string): Promise<Slot> => {
    const response = await adminApi.post(`/slots/${id}/block`, { reason });
    return response.data;
  },

  // Unblock slot
  unblockSlot: async (id: string): Promise<Slot> => {
    const response = await adminApi.post(`/slots/${id}/unblock`);
    return response.data;
  },

  // Get slot availability for a ground
  getAvailability: async (groundId: string, date: string): Promise<Slot[]> => {
    const response = await adminApi.get(`/slots/availability/${groundId}`, {
      params: { date },
    });
    return response.data;
  },
};

export default slotService;
