import adminApi from './api';

export interface ApiKey {
  id: string;
  key: string;
  label: string;
  platform: string;
  turfId: string;
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  permissions: string[];
  rateLimit: number;
  usageCount: number;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyData {
  label: string;
  platform: string;
  turfId: string;
  permissions?: string[];
  rateLimit?: number;
  expiresAt?: string;
}

export interface ApiKeyFilters {
  turfId?: string;
  platform?: string;
  status?: ApiKey['status'];
}

export const apiKeyService = {
  // Get all API keys
  getAll: async (filters?: ApiKeyFilters): Promise<ApiKey[]> => {
    const response = await adminApi.get('/api-keys', { params: filters });
    return response.data;
  },

  // Get single API key by ID
  getById: async (id: string): Promise<ApiKey> => {
    const response = await adminApi.get(`/api-keys/${id}`);
    return response.data;
  },

  // Generate new API key
  create: async (data: CreateApiKeyData): Promise<ApiKey> => {
    const response = await adminApi.post('/api-keys', data);
    return response.data;
  },

  // Update API key (label, permissions, rate limit)
  update: async (id: string, data: Partial<CreateApiKeyData>): Promise<ApiKey> => {
    const response = await adminApi.put(`/api-keys/${id}`, data);
    return response.data;
  },

  // Revoke API key
  revoke: async (id: string): Promise<void> => {
    await adminApi.post(`/api-keys/${id}/revoke`);
  },

  // Reactivate API key
  reactivate: async (id: string): Promise<ApiKey> => {
    const response = await adminApi.post(`/api-keys/${id}/reactivate`);
    return response.data;
  },

  // Delete API key permanently
  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/api-keys/${id}`);
  },

  // Regenerate API key (creates new key string)
  regenerate: async (id: string): Promise<ApiKey> => {
    const response = await adminApi.post(`/api-keys/${id}/regenerate`);
    return response.data;
  },

  // Get API key usage statistics
  getUsageStats: async (id: string, startDate?: string, endDate?: string): Promise<{
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    callsByEndpoint: { endpoint: string; count: number }[];
    callsByDay: { date: string; count: number }[];
  }> => {
    const response = await adminApi.get(`/api-keys/${id}/stats`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default apiKeyService;
