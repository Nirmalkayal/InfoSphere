import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiKeyService, ApiKey, CreateApiKeyData, ApiKeyFilters } from '@/services';
import { toast } from '@/hooks/use-toast';

export const useApiKeys = (filters?: ApiKeyFilters) => {
  const queryClient = useQueryClient();

  // Fetch API keys
  const {
    data: apiKeys = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['apiKeys', filters],
    queryFn: () => apiKeyService.getAll(filters),
    staleTime: 60000, // 1 minute
  });

  // Create API key mutation
  const createApiKey = useMutation({
    mutationFn: (data: CreateApiKeyData) => apiKeyService.create(data),
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ 
        title: 'API Key created', 
        description: `Key: ${newKey.key.substring(0, 12)}...` 
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create API key', description: error.message, variant: 'destructive' });
    },
  });

  // Update API key mutation
  const updateApiKey = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateApiKeyData> }) =>
      apiKeyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ title: 'API Key updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update API key', description: error.message, variant: 'destructive' });
    },
  });

  // Revoke API key mutation
  const revokeApiKey = useMutation({
    mutationFn: (id: string) => apiKeyService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ title: 'API Key revoked successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to revoke API key', description: error.message, variant: 'destructive' });
    },
  });

  // Reactivate API key mutation
  const reactivateApiKey = useMutation({
    mutationFn: (id: string) => apiKeyService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ title: 'API Key reactivated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to reactivate API key', description: error.message, variant: 'destructive' });
    },
  });

  // Delete API key mutation
  const deleteApiKey = useMutation({
    mutationFn: (id: string) => apiKeyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ title: 'API Key deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete API key', description: error.message, variant: 'destructive' });
    },
  });

  // Regenerate API key mutation
  const regenerateApiKey = useMutation({
    mutationFn: (id: string) => apiKeyService.regenerate(id),
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({ 
        title: 'API Key regenerated', 
        description: `New key: ${newKey.key.substring(0, 12)}...` 
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to regenerate API key', description: error.message, variant: 'destructive' });
    },
  });

  // Filter helpers
  const activeKeys = apiKeys.filter((key: ApiKey) => key.status === 'active');
  const revokedKeys = apiKeys.filter((key: ApiKey) => key.status === 'revoked');

  return {
    apiKeys,
    activeKeys,
    revokedKeys,
    isLoading,
    error,
    refetch,
    createApiKey: createApiKey.mutate,
    updateApiKey: updateApiKey.mutate,
    revokeApiKey: revokeApiKey.mutate,
    reactivateApiKey: reactivateApiKey.mutate,
    deleteApiKey: deleteApiKey.mutate,
    regenerateApiKey: regenerateApiKey.mutate,
    isCreating: createApiKey.isPending,
    isUpdating: updateApiKey.isPending,
    isRevoking: revokeApiKey.isPending,
    isDeleting: deleteApiKey.isPending,
    isRegenerating: regenerateApiKey.isPending,
  };
};

export const useApiKeyStats = (apiKeyId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['apiKeyStats', apiKeyId, startDate, endDate],
    queryFn: () => apiKeyService.getUsageStats(apiKeyId, startDate, endDate),
    enabled: !!apiKeyId,
    staleTime: 60000, // 1 minute
  });
};

export default useApiKeys;
