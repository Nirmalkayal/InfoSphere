import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';

export const useDashboardStats = (turfId?: string) => {
  return useQuery({
    queryKey: ['dashboardStats', turfId],
    queryFn: () => dashboardService.getStats(turfId),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const usePlatformSessions = (turfId?: string) => {
  return useQuery({
    queryKey: ['platformSessions', turfId],
    queryFn: () => dashboardService.getPlatformSessions(turfId),
    staleTime: 30000,
  });
};

export const useDailyOverview = (turfId?: string) => {
  return useQuery({
    queryKey: ['dailyOverview', turfId],
    queryFn: () => dashboardService.getDailyOverview(turfId),
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const usePerformanceData = (period: 'week' | 'month' | 'year' = 'week', turfId?: string) => {
  return useQuery({
    queryKey: ['performanceData', period, turfId],
    queryFn: () => dashboardService.getPerformanceData(period, turfId),
    staleTime: 60000, // 1 minute
  });
};

export const useRecentActivity = (turfId?: string, limit = 10) => {
  return useQuery({
    queryKey: ['recentActivity', turfId, limit],
    queryFn: () => dashboardService.getRecentActivity(turfId, limit),
    staleTime: 30000,
    refetchInterval: 30000,
  });
};

export const useSlotVisibility = (turfId?: string) => {
  return useQuery({
    queryKey: ['slotVisibility', turfId],
    queryFn: () => dashboardService.getSlotVisibility(turfId),
    staleTime: 60000,
  });
};

// Aggregate hook for dashboard page
export const useDashboard = (turfId?: string) => {
  const stats = useDashboardStats(turfId);
  const sessions = usePlatformSessions(turfId);
  const daily = useDailyOverview(turfId);
  const performance = usePerformanceData('week', turfId);
  const activity = useRecentActivity(turfId);
  const visibility = useSlotVisibility(turfId);

  const isLoading =
    stats.isLoading ||
    sessions.isLoading ||
    daily.isLoading ||
    performance.isLoading ||
    activity.isLoading ||
    visibility.isLoading;

  const error =
    stats.error ||
    sessions.error ||
    daily.error ||
    performance.error ||
    activity.error ||
    visibility.error;

  return {
    stats: stats.data,
    sessions: sessions.data,
    daily: daily.data,
    performance: performance.data,
    activity: activity.data,
    visibility: visibility.data,
    isLoading,
    error,
    refetch: () => {
      stats.refetch();
      sessions.refetch();
      daily.refetch();
      performance.refetch();
      activity.refetch();
      visibility.refetch();
    },
  };
};

export default useDashboard;
