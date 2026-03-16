import { create } from 'zustand';
import type { Collection, CollectionCategory, MediaType } from '@/types';

interface CollectionFilters {
  branch?: string;
  category?: CollectionCategory;
  mediaType?: MediaType;
  search?: string;
}

interface CollectionState {
  collections: Collection[];
  selectedCollection: Collection | null;
  filters: CollectionFilters;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setCollections: (collections: Collection[]) => void;
  setSelectedCollection: (collection: Collection | null) => void;
  setFilters: (filters: Partial<CollectionFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  selectedCollection: null,
  filters: {},
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  setCollections: (collections) => set({ collections }),
  setSelectedCollection: (collection) => set({ selectedCollection: collection }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters }, page: 1 })),
  clearFilters: () => set({ filters: {}, page: 1 }),
  setPage: (page) => set({ page }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
