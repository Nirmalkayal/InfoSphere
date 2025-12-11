import { useQuery } from '@tanstack/react-query';
import { logService, LogFilters } from '@/services';

export const useLogs = (filters?: LogFilters) => {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: () => logService.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useLogStats = (turfId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['logStats', turfId, startDate, endDate],
    queryFn: () => logService.getStats(turfId, startDate, endDate),
    staleTime: 60000, // 1 minute
  });
};

export const useRecentLogs = (turfId?: string, limit = 50) => {
  return useQuery({
    queryKey: ['recentLogs', turfId, limit],
    queryFn: () => logService.getRecent(turfId, limit),
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });
};

export const useFailedLogs = (filters?: Omit<LogFilters, 'status'>) => {
  return useQuery({
    queryKey: ['failedLogs', filters],
    queryFn: () => logService.getFailed(filters),
    staleTime: 30000,
  });
};

// Export CSV helper
export const exportLogsAsCsv = async (filters?: Omit<LogFilters, 'page' | 'limit'>) => {
  try {
    const blob = await logService.exportCsv(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export logs:', error);
    throw error;
  }
};

export default useLogs;
