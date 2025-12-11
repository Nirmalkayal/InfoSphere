import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turfService, Turf, CreateTurfData, CreateGroundData } from '@/services';
import { toast } from '@/hooks/use-toast';

export const useTurfs = () => {
  const queryClient = useQueryClient();

  // Fetch all turfs
  const {
    data: turfs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['turfs'],
    queryFn: () => turfService.getAll(),
    staleTime: 60000, // 1 minute
  });

  // Create turf mutation
  const createTurf = useMutation({
    mutationFn: (data: CreateTurfData) => turfService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Turf created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create turf', description: error.message, variant: 'destructive' });
    },
  });

  // Update turf mutation
  const updateTurf = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTurfData> }) =>
      turfService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Turf updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update turf', description: error.message, variant: 'destructive' });
    },
  });

  // Delete turf mutation
  const deleteTurf = useMutation({
    mutationFn: (id: string) => turfService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Turf deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete turf', description: error.message, variant: 'destructive' });
    },
  });

  return {
    turfs,
    isLoading,
    error,
    refetch,
    createTurf: createTurf.mutate,
    updateTurf: updateTurf.mutate,
    deleteTurf: deleteTurf.mutate,
    isCreating: createTurf.isPending,
    isUpdating: updateTurf.isPending,
    isDeleting: deleteTurf.isPending,
  };
};

export const useTurf = (id: string) => {
  return useQuery({
    queryKey: ['turf', id],
    queryFn: () => turfService.getById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useTurfGrounds = (turfId: string) => {
  const queryClient = useQueryClient();

  // Add ground mutation
  const addGround = useMutation({
    mutationFn: (data: CreateGroundData) => turfService.addGround(turfId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turf', turfId] });
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Ground added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add ground', description: error.message, variant: 'destructive' });
    },
  });

  // Update ground mutation
  const updateGround = useMutation({
    mutationFn: ({ groundId, data }: { groundId: string; data: Partial<CreateGroundData> }) =>
      turfService.updateGround(turfId, groundId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turf', turfId] });
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Ground updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update ground', description: error.message, variant: 'destructive' });
    },
  });

  // Delete ground mutation
  const deleteGround = useMutation({
    mutationFn: (groundId: string) => turfService.deleteGround(turfId, groundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turf', turfId] });
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      toast({ title: 'Ground deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete ground', description: error.message, variant: 'destructive' });
    },
  });

  return {
    addGround: addGround.mutate,
    updateGround: updateGround.mutate,
    deleteGround: deleteGround.mutate,
    isAddingGround: addGround.isPending,
    isUpdatingGround: updateGround.isPending,
    isDeletingGround: deleteGround.isPending,
  };
};

export const useTurfStats = (turfId: string) => {
  return useQuery({
    queryKey: ['turfStats', turfId],
    queryFn: () => turfService.getStats(turfId),
    enabled: !!turfId,
    staleTime: 60000,
  });
};

export default useTurfs;
