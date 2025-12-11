import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lockService, Lock, LockFilters } from '@/services';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from '@/hooks/use-toast';

export const useLocks = (filters?: LockFilters) => {
  const queryClient = useQueryClient();
  const { onLockEvent } = useSocket();

  // Fetch locks
  const {
    data: locks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['locks', filters],
    queryFn: () => lockService.getAll(filters),
    staleTime: 10000, // 10 seconds - locks change frequently
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });

  // Listen for real-time lock events
  useEffect(() => {
    const unsubscribe = onLockEvent((data) => {
      queryClient.invalidateQueries({ queryKey: ['locks'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      
      const actionText = {
        acquired: 'acquired',
        released: 'released',
        expired: 'expired',
      }[data.action];
      
      toast({
        title: `Lock ${actionText}`,
        description: `${data.platform} ${actionText} lock on slot`,
      });
    });

    return unsubscribe;
  }, [onLockEvent, queryClient]);

  // Force unlock mutation
  const forceUnlock = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      lockService.forceUnlock(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locks'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Lock released successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to release lock', description: error.message, variant: 'destructive' });
    },
  });

  // Force unlock bulk mutation
  const forceUnlockBulk = useMutation({
    mutationFn: ({ lockIds, reason }: { lockIds: string[]; reason?: string }) =>
      lockService.forceUnlockBulk(lockIds, reason),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['locks'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: `${result.released} locks released successfully` });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to release locks', description: error.message, variant: 'destructive' });
    },
  });

  // Active locks only
  const activeLocks = locks.filter((lock: Lock) => lock.status === 'active');

  return {
    locks,
    activeLocks,
    isLoading,
    error,
    refetch,
    forceUnlock: forceUnlock.mutate,
    forceUnlockBulk: forceUnlockBulk.mutate,
    isUnlocking: forceUnlock.isPending,
    isUnlockingBulk: forceUnlockBulk.isPending,
  };
};

export const useLockStats = (turfId?: string) => {
  return useQuery({
    queryKey: ['lockStats', turfId],
    queryFn: () => lockService.getStats(turfId),
    staleTime: 60000, // 1 minute
  });
};

export const useSlotLockHistory = (slotId: string) => {
  return useQuery({
    queryKey: ['slotLockHistory', slotId],
    queryFn: () => lockService.getSlotLockHistory(slotId),
    enabled: !!slotId,
  });
};

export default useLocks;
