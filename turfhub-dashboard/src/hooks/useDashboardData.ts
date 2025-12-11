import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { toast } from './use-toast';

export const useDashboardData = () => {
  const [performance, setPerformance] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch stats from API
        const data = await ApiService.getDashboardStats();
        setStats({
          totalApiCalls: data.stats.bookings || 0, // Mapping bookings to calls for demo
          activeIntegrations: 3, // Hardcoded or fetch
          registeredGrounds: 3, // Hardcoded or fetch
          failedRequests: 0
        });

        // Transform revenueChart for performance graph
        const chartData = data.revenueChart.map((item: any) => ({
          month: item._id, // Date string
          value: item.revenue
        }));
        if (chartData.length > 0) setPerformance(chartData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
        toast({
          title: "Connection Error",
          description: "Could not connect to the backend.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    load();
  }, []);

  return { performance, platforms, channels, stats, loading, error };
};
