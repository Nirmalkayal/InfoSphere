import adminApi from './api';

export interface Ground {
  id: string;
  name: string;
  type: string; // 'football', 'cricket', 'badminton', etc.
  capacity: number;
  pricePerHour: number;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  grounds: Ground[];
  totalSlots: number;
  activeIntegrations: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTurfData {
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
}

export interface CreateGroundData {
  name: string;
  type: string;
  capacity: number;
  pricePerHour: number;
}

export const turfService = {
  // Get all turfs
  getAll: async (): Promise<Turf[]> => {
    const response = await adminApi.get('/turfs');
    return response.data;
  },

  // Get single turf by ID
  getById: async (id: string): Promise<Turf> => {
    const response = await adminApi.get(`/turfs/${id}`);
    return response.data;
  },

  // Create new turf
  create: async (data: CreateTurfData): Promise<Turf> => {
    const response = await adminApi.post('/turfs', data);
    return response.data;
  },

  // Update turf
  update: async (id: string, data: Partial<CreateTurfData>): Promise<Turf> => {
    const response = await adminApi.put(`/turfs/${id}`, data);
    return response.data;
  },

  // Delete turf
  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/turfs/${id}`);
  },

  // Add ground to turf
  addGround: async (turfId: string, data: CreateGroundData): Promise<Ground> => {
    const response = await adminApi.post(`/turfs/${turfId}/grounds`, data);
    return response.data;
  },

  // Update ground
  updateGround: async (turfId: string, groundId: string, data: Partial<CreateGroundData>): Promise<Ground> => {
    const response = await adminApi.put(`/turfs/${turfId}/grounds/${groundId}`, data);
    return response.data;
  },

  // Delete ground
  deleteGround: async (turfId: string, groundId: string): Promise<void> => {
    await adminApi.delete(`/turfs/${turfId}/grounds/${groundId}`);
  },

  // Get turf statistics
  getStats: async (turfId: string): Promise<{
    totalBookings: number;
    revenue: number;
    activeSlots: number;
    popularTimes: { hour: number; count: number }[];
  }> => {
    const response = await adminApi.get(`/turfs/${turfId}/stats`);
    return response.data;
  },
};

export default turfService;
