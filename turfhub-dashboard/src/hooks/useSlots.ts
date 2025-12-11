import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotService, Slot, SlotFilters, CreateSlotData, GenerateSlotsData } from '@/services';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from '@/hooks/use-toast';

export const useSlots = (filters?: SlotFilters) => {
  const queryClient = useQueryClient();
  const { onSlotUpdate } = useSocket();

  // Fetch slots
  const {
    data: slots = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['slots', filters],
    queryFn: () => slotService.getAll(filters),
    staleTime: 30000, // 30 seconds
  });

  // Listen for real-time slot updates
  useEffect(() => {
    const unsubscribe = onSlotUpdate((data) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({
        title: 'Slot Updated',
        description: `Slot ${data.slotId} is now ${data.status}`,
      });
    });

    return unsubscribe;
  }, [onSlotUpdate, queryClient]);

  // Create slot mutation
  const createSlot = useMutation({
    mutationFn: (data: CreateSlotData) => slotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Slot created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create slot', description: error.message, variant: 'destructive' });
    },
  });

  // Generate slots mutation
  const generateSlots = useMutation({
    mutationFn: (data: GenerateSlotsData) => slotService.generateSlots(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: `${result.created} slots generated successfully` });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to generate slots', description: error.message, variant: 'destructive' });
    },
  });

  // Update slot mutation
  const updateSlot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Slot> }) => slotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Slot updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update slot', description: error.message, variant: 'destructive' });
    },
  });

  // Delete slot mutation
  const deleteSlot = useMutation({
    mutationFn: (id: string) => slotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Slot deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete slot', description: error.message, variant: 'destructive' });
    },
  });

  // Block slot mutation
  const blockSlot = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => slotService.blockSlot(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Slot blocked successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to block slot', description: error.message, variant: 'destructive' });
    },
  });

  // Unblock slot mutation
  const unblockSlot = useMutation({
    mutationFn: (id: string) => slotService.unblockSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast({ title: 'Slot unblocked successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to unblock slot', description: error.message, variant: 'destructive' });
    },
  });

  return {
    slots,
    isLoading,
    error,
    refetch,
    createSlot: createSlot.mutate,
    generateSlots: generateSlots.mutate,
    updateSlot: updateSlot.mutate,
    deleteSlot: deleteSlot.mutate,
    blockSlot: blockSlot.mutate,
    unblockSlot: unblockSlot.mutate,
    isCreating: createSlot.isPending,
    isGenerating: generateSlots.isPending,
    isUpdating: updateSlot.isPending,
    isDeleting: deleteSlot.isPending,
  };
};

export const useSlotsByDateRange = (turfId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['slots', turfId, startDate, endDate],
    queryFn: () => slotService.getByDateRange(turfId, startDate, endDate),
    enabled: !!turfId && !!startDate && !!endDate,
    staleTime: 30000,
  });
};

export default useSlots;
