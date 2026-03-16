import { create } from 'zustand';
import type { Branch } from '@/types';

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
  setBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  branches: [],
  selectedBranch: null,
  isLoading: false,
  error: null,
  setBranches: (branches) => set({ branches }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
