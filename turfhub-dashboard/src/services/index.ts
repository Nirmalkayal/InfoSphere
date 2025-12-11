// Export all services
export { default as adminApi, externalApi } from './api';
export { default as authService } from './auth';
export { default as turfService } from './turfs';
export { default as slotService } from './slots';
export { default as lockService } from './locks';
export { default as apiKeyService } from './apiKeys';
export { default as logService } from './logs';
export { default as webhookService } from './webhooks';
export { default as userService } from './users';
export { default as dashboardService } from './dashboard';

// Export types
export type { LoginCredentials, User, AuthResponse } from './auth';
export type { Turf, Ground, CreateTurfData, CreateGroundData } from './turfs';
export type { Slot, CreateSlotData, GenerateSlotsData, SlotFilters } from './slots';
export type { Lock, LockFilters } from './locks';
export type { ApiKey, CreateApiKeyData, ApiKeyFilters } from './apiKeys';
export type { AuditLog, LogFilters, LogsResponse, LogStats } from './logs';
export type { Webhook, WebhookEvent, CreateWebhookData, WebhookDelivery } from './webhooks';
export type { StaffUser, CreateUserData, UpdateUserData } from './users';
export type {
  DashboardStats,
  PlatformSession,
  DailyOverview,
  PerformanceData,
  RecentActivity,
} from './dashboard';
