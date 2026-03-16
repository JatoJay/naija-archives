import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCollections,
  getCollectionById,
  getCollectionItems,
  getRecentItems,
  createCollection,
  updateCollection,
  deleteCollection,
} from '@/services/collections';
import type { CollectionCategory, MediaType } from '@/types';

interface UseCollectionsParams {
  branch?: string;
  category?: CollectionCategory;
  page?: number;
  limit?: number;
  search?: string;
}

export function useCollections(params: UseCollectionsParams = {}) {
  const query = useQuery({
    queryKey: ['collections', params],
    queryFn: () => getCollections(params),
  });

  return {
    collections: query.data?.data || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => getCollectionById(id),
    enabled: !!id,
  });
}

export function useCollectionItems(
  id: string,
  params: { mediaType?: MediaType; page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ['collections', id, 'items', params],
    queryFn: () => getCollectionItems(id, params),
    enabled: !!id,
  });
}

export function useRecentItems() {
  return useQuery({
    queryKey: ['recent-items'],
    queryFn: getRecentItems,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCollection>[1] }) =>
      updateCollection(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', id] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}
