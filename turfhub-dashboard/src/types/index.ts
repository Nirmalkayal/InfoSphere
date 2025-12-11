export interface PerformancePoint { month: string; value: number }
export interface PlatformPoint { name: string; value: number; color: string }
export interface ChannelPoint { name: string; traffic: number; color: string }
export interface DashboardStats {
  totalApiCalls: number
  activeIntegrations: number
  registeredGrounds: number
  failedRequests: number
}
export interface Turf {
  _id: string
  name: string
  location: string
  city?: string
  pricePerSlot?: number
  operatingHours?: { start: string; end: string }
}
export interface Slot {
  _id: string
  turfId?: string
  date?: string
  startTime?: string
  endTime?: string
  status: 'available' | 'booked' | 'locked'
  price?: number
  platform?: string
}
export interface Lock {
  _id: string
  slotId?: string
  turfId?: string
  platform?: string
  externalId?: string
  status: 'active' | 'released' | 'expired'
  expiresAt: string
}
