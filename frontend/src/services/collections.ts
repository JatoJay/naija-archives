import api from './api';
import type {
  Collection,
  CollectionDetail,
  ArchiveItem,
  PaginatedResponse,
  CollectionCategory,
  MediaType,
} from '@/types';

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
  const response = await api.get<PaginatedResponse<Collection>>('/collections', {
    params,
  });
  return response.data;
}

export async function getCollectionById(id: string): Promise<CollectionDetail> {
  const response = await api.get<CollectionDetail>(`/collections/${id}`);
  return response.data;
}

export async function getCollectionItems(
  id: string,
  params: { mediaType?: MediaType; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<ArchiveItem>> {
  const response = await api.get<PaginatedResponse<ArchiveItem>>(
    `/collections/${id}/items`,
    { params }
  );
  return response.data;
}

export async function getRecentItems(): Promise<ArchiveItem[]> {
  const response = await api.get<ArchiveItem[]>('/collections/recent-items');
  return response.data;
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
