'use client';

import { useSettingsStore } from '@/store/settings';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, setSettings } = useSettingsStore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
            <input
              type="password"
              className="w-full border rounded p-2 text-black"
              value={settings.openaiKey}
              onChange={(e) => setSettings({ openaiKey: e.target.value })}
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Claude API Key</label>
            <input
              type="password"
              className="w-full border rounded p-2 text-black"
              value={settings.claudeKey}
              onChange={(e) => setSettings({ claudeKey: e.target.value })}
              placeholder="sk-ant-..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gemini API Key</label>
            <input
              type="password"
              className="w-full border rounded p-2 text-black"
              value={settings.geminiKey}
              onChange={(e) => setSettings({ geminiKey: e.target.value })}
              placeholder="AIza..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LM Studio URL</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-black"
              value={settings.lmStudioUrl}
              onChange={(e) => setSettings({ lmStudioUrl: e.target.value })}
              placeholder="http://localhost:1234/v1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
