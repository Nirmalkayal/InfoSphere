import adminApi from './api';

export interface Webhook {
  id: string;
  turfId: string;
  platform: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  status: 'active' | 'inactive' | 'failed';
  lastTriggered?: string;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export type WebhookEvent = 
  | 'slot.created'
  | 'slot.updated'
  | 'slot.deleted'
  | 'slot.booked'
  | 'slot.cancelled'
  | 'lock.acquired'
  | 'lock.released'
  | 'lock.expired';

export interface CreateWebhookData {
  turfId: string;
  platform: string;
  url: string;
  events: WebhookEvent[];
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: 'success' | 'failed';
  statusCode?: number;
  responseTime?: number;
  errorMessage?: string;
  attempts: number;
  createdAt: string;
}

export const webhookService = {
  // Get all webhooks for a turf
  getAll: async (turfId?: string): Promise<Webhook[]> => {
    const response = await adminApi.get('/webhooks', { params: { turfId } });
    return response.data;
  },

  // Get single webhook by ID
  getById: async (id: string): Promise<Webhook> => {
    const response = await adminApi.get(`/webhooks/${id}`);
    return response.data;
  },

  // Create new webhook
  create: async (data: CreateWebhookData): Promise<Webhook> => {
    const response = await adminApi.post('/webhooks', data);
    return response.data;
  },

  // Update webhook
  update: async (id: string, data: Partial<CreateWebhookData>): Promise<Webhook> => {
    const response = await adminApi.put(`/webhooks/${id}`, data);
    return response.data;
  },

  // Delete webhook
  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/webhooks/${id}`);
  },

  // Test webhook
  test: async (id: string): Promise<{ success: boolean; statusCode: number; responseTime: number }> => {
    const response = await adminApi.post(`/webhooks/${id}/test`);
    return response.data;
  },

  // Regenerate webhook secret
  regenerateSecret: async (id: string): Promise<{ secret: string }> => {
    const response = await adminApi.post(`/webhooks/${id}/regenerate-secret`);
    return response.data;
  },

  // Get webhook delivery history
  getDeliveries: async (webhookId: string, page = 1, limit = 20): Promise<{
    deliveries: WebhookDelivery[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await adminApi.get(`/webhooks/${webhookId}/deliveries`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Retry failed delivery
  retryDelivery: async (deliveryId: string): Promise<WebhookDelivery> => {
    const response = await adminApi.post(`/webhooks/deliveries/${deliveryId}/retry`);
    return response.data;
  },
};

export default webhookService;
