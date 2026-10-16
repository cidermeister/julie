import { create } from 'zustand';

interface WorkspaceState {
  directoryHandle: unknown | null;
  repoName: string;
  branches: string[];
  currentBranch: string;
  setDirectoryHandle: (handle: unknown) => void;
  loadBranches: (handle: unknown) => Promise<void>;
  setCurrentBranch: (branch: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  directoryHandle: null,
  repoName: '',
  branches: [],
  currentBranch: 'main',

  setDirectoryHandle: async (handle) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set({ directoryHandle: handle, repoName: (handle as any).name });
  },

  loadBranches: async () => {
    try {
      set({ branches: ['main', 'dev', 'feature/agents'] });
    } catch (e) {
      console.error(e);
    }
  },

  setCurrentBranch: (branch) => set({ currentBranch: branch }),
}));
