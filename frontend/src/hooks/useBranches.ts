import { useQuery } from '@tanstack/react-query';
import { getBranches, getBranchBySlug, getPortalStats } from '@/services/branches';

export function useBranches(slug?: string) {
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
    staleTime: 1000 * 60 * 5,
  });

  const branchQuery = useQuery({
    queryKey: ['branches', slug],
    queryFn: () => getBranchBySlug(slug!),
    enabled: !!slug,
  });

  const statsQuery = useQuery({
    queryKey: ['portal-stats'],
    queryFn: getPortalStats,
    staleTime: 1000 * 60 * 5,
  });

  return {
    branches: branchesQuery.data || [],
    branch: branchQuery.data,
    stats: statsQuery.data,
    isLoading: branchesQuery.isLoading || (slug ? branchQuery.isLoading : false),
    error: branchesQuery.error || branchQuery.error,
  };
}

export function useBranch(slug: string) {
  return useQuery({
    queryKey: ['branches', slug],
    queryFn: () => getBranchBySlug(slug),
    enabled: !!slug,
  });
}

export function usePortalStats() {
  return useQuery({
    queryKey: ['portal-stats'],
    queryFn: getPortalStats,
    staleTime: 1000 * 60 * 5,
  });
}
