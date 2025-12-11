import adminApi from './api';

export interface AuditLog {
  id: string;
  timestamp: string;
  platform: string;
  apiKeyId: string;
  apiKeyLabel: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'success' | 'failed';
  statusCode: number;
  responseTime: number; // in ms
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  errorMessage?: string;
  ipAddress: string;
  userAgent: string;
  turfId: string;
}

export interface LogFilters {
  turfId?: string;
  platform?: string;
  apiKeyId?: string;
  status?: 'success' | 'failed';
  method?: AuditLog['method'];
  startDate?: string;
  endDate?: string;
  endpoint?: string;
  page?: number;
  limit?: number;
}

export interface LogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LogStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  requestsByPlatform: { platform: string; count: number }[];
  requestsByEndpoint: { endpoint: string; count: number }[];
  requestsByHour: { hour: number; count: number }[];
}

export const logService = {
  // Get all logs with pagination and filters
  getAll: async (filters?: LogFilters): Promise<LogsResponse> => {
    const response = await adminApi.get('/logs', { params: filters });
    return response.data;
  },

  // Get single log by ID
  getById: async (id: string): Promise<AuditLog> => {
    const response = await adminApi.get(`/logs/${id}`);
    return response.data;
  },

  // Get log statistics
  getStats: async (turfId?: string, startDate?: string, endDate?: string): Promise<LogStats> => {
    const response = await adminApi.get('/logs/stats', {
      params: { turfId, startDate, endDate },
    });
    return response.data;
  },

  // Export logs as CSV
  exportCsv: async (filters?: Omit<LogFilters, 'page' | 'limit'>): Promise<Blob> => {
    const response = await adminApi.get('/logs/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Get recent logs (last 24 hours)
  getRecent: async (turfId?: string, limit = 50): Promise<AuditLog[]> => {
    const response = await adminApi.get('/logs/recent', {
      params: { turfId, limit },
    });
    return response.data;
  },

  // Get failed logs
  getFailed: async (filters?: Omit<LogFilters, 'status'>): Promise<LogsResponse> => {
    const response = await adminApi.get('/logs', {
      params: { ...filters, status: 'failed' },
    });
    return response.data;
  },
};

export default logService;
