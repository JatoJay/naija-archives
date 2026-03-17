import api from './api';
import type { Branch, BranchDetail, PortalStats } from '@/types';
import { MOCK_BRANCHES, MOCK_STATS } from './mockData';

export async function getBranches(): Promise<Branch[]> {
  try {
    const response = await api.get<Branch[]>('/branches');
    return response.data;
  } catch {
    console.warn('API unavailable, using mock data for branches');
    return MOCK_BRANCHES;
  }
}

export async function getBranchBySlug(slug: string): Promise<BranchDetail> {
  try {
    const response = await api.get<BranchDetail>(`/branches/${slug}`);
    return response.data;
  } catch {
    console.warn('API unavailable, using mock data for branch detail');
    const branch = MOCK_BRANCHES.find((b) => b.slug === slug);
    if (!branch) {
      throw new Error('Branch not found');
    }
    return {
      ...branch,
      itemsByType: { DOCUMENT: 100, IMAGE: 50, AUDIO: 20, VIDEO: 10 },
    };
  }
}

export async function getPortalStats(): Promise<PortalStats> {
  try {
    const response = await api.get<PortalStats>('/branches/stats');
    return response.data;
  } catch {
    console.warn('API unavailable, using mock stats');
    return MOCK_STATS;
  }
}
