import api from './api';
import type { Branch, BranchDetail, PortalStats } from '@/types';

export async function getBranches(): Promise<Branch[]> {
  const response = await api.get<Branch[]>('/branches');
  return response.data;
}

export async function getBranchBySlug(slug: string): Promise<BranchDetail> {
  const response = await api.get<BranchDetail>(`/branches/${slug}`);
  return response.data;
}

export async function getPortalStats(): Promise<PortalStats> {
  const response = await api.get<PortalStats>('/branches/stats');
  return response.data;
}
