import adminApi from './api';

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'manager' | 'staff';
  turfId: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  phone?: string;
  role: StaffUser['role'];
  turfId: string;
  permissions?: string[];
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  role?: StaffUser['role'];
  status?: StaffUser['status'];
  permissions?: string[];
}

export const userService = {
  // Get all users
  getAll: async (turfId?: string): Promise<StaffUser[]> => {
    const response = await adminApi.get('/users', { params: { turfId } });
    return response.data;
  },

  // Get single user by ID
  getById: async (id: string): Promise<StaffUser> => {
    const response = await adminApi.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (invite)
  create: async (data: CreateUserData): Promise<StaffUser> => {
    const response = await adminApi.post('/users', data);
    return response.data;
  },

  // Update user
  update: async (id: string, data: UpdateUserData): Promise<StaffUser> => {
    const response = await adminApi.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/users/${id}`);
  },

  // Deactivate user
  deactivate: async (id: string): Promise<StaffUser> => {
    const response = await adminApi.post(`/users/${id}/deactivate`);
    return response.data;
  },

  // Reactivate user
  reactivate: async (id: string): Promise<StaffUser> => {
    const response = await adminApi.post(`/users/${id}/reactivate`);
    return response.data;
  },

  // Resend invitation email
  resendInvite: async (id: string): Promise<void> => {
    await adminApi.post(`/users/${id}/resend-invite`);
  },

  // Update own profile
  updateProfile: async (data: { name?: string; phone?: string }): Promise<StaffUser> => {
    const response = await adminApi.put('/users/me', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await adminApi.post('/users/me/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export default userService;
