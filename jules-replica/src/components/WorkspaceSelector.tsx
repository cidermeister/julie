'use client';

import { useWorkspaceStore } from '@/store/workspace';

export default function WorkspaceSelector() {
  const { directoryHandle, repoName, branches, currentBranch, setDirectoryHandle, loadBranches, setCurrentBranch } = useWorkspaceStore();

  const handleSelectDirectory = async () => {
    try {
      // @ts-expect-error - File System Access API
      const dirHandle = await window.showDirectoryPicker();
      await setDirectoryHandle(dirHandle);
      await loadBranches(dirHandle);
    } catch (e) {
      console.error('User cancelled or error:', e);
    }
  };

  return (
    <div className="p-4 bg-gray-100 border-b flex flex-col gap-2">
      <h2 className="font-bold text-gray-800">Workspace</h2>

      {!directoryHandle ? (
        <button
          onClick={handleSelectDirectory}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Select Repository Directory
        </button>
      ) : (
        <div className="text-sm text-gray-800 space-y-2">
          <p>
            <span className="font-semibold">Repo:</span> {repoName}
          </p>
          <div>
            <label className="font-semibold mr-2">Branch:</label>
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="p-1 border rounded"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSelectDirectory}
            className="text-blue-600 underline text-xs"
          >
            Change Directory
          </button>
        </div>
      )}
    </div>
  );
}
