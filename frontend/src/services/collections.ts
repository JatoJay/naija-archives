import api from './api';
import type {
  Collection,
  CollectionDetail,
  ArchiveItem,
  PaginatedResponse,
  CollectionCategory,
  MediaType,
} from '@/types';
import { MOCK_COLLECTIONS, getMockCollectionsPaginated } from './mockData';

interface GetCollectionsParams {
  branch?: string;
  category?: CollectionCategory;
  page?: number;
  limit?: number;
  search?: string;
}

export async function getCollections(
  params: GetCollectionsParams = {}
): Promise<PaginatedResponse<Collection>> {
  try {
    const response = await api.get<PaginatedResponse<Collection>>('/collections', {
      params,
    });
    return response.data;
  } catch {
    console.warn('API unavailable, using mock collections');
    return getMockCollectionsPaginated({ page: params.page, limit: params.limit });
  }
}

export async function getCollectionById(id: string): Promise<CollectionDetail> {
  try {
    const response = await api.get<CollectionDetail>(`/collections/${id}`);
    return response.data;
  } catch {
    console.warn('API unavailable, using mock collection detail');
    const collection = MOCK_COLLECTIONS.find((c) => c.id === id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    return {
      ...collection,
      items: [],
      itemsByType: { DOCUMENT: 50, IMAGE: 25, AUDIO: 10, VIDEO: 5 },
    };
  }
}

export async function getCollectionItems(
  id: string,
  params: { mediaType?: MediaType; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<ArchiveItem>> {
  try {
    const response = await api.get<PaginatedResponse<ArchiveItem>>(
      `/collections/${id}/items`,
      { params }
    );
    return response.data;
  } catch {
    console.warn('API unavailable, returning empty items');
    return {
      data: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export async function getRecentItems(): Promise<ArchiveItem[]> {
  try {
    const response = await api.get<ArchiveItem[]>('/collections/recent-items');
    return response.data;
  } catch {
    console.warn('API unavailable, returning empty recent items');
    return [];
  }
}

export async function createCollection(data: {
  branchId: string;
  title: string;
  description: string;
  category: CollectionCategory;
  startYear?: number;
  endYear?: number;
  thumbnailUrl?: string;
}): Promise<Collection> {
  const response = await api.post<Collection>('/collections', data);
  return response.data;
}

export async function updateCollection(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: CollectionCategory;
    startYear: number;
    endYear: number;
    thumbnailUrl: string;
  }>
): Promise<Collection> {
  const response = await api.patch<Collection>(`/collections/${id}`, data);
  return response.data;
}

export async function deleteCollection(id: string): Promise<void> {
  await api.delete(`/collections/${id}`);
}
