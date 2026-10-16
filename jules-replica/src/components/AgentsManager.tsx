'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AgentsManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, model, systemPrompt }),
      });
      if (res.ok) {
        toast.success('Agent created!');
        setIsCreating(false);
        setName('');
        setSystemPrompt('');
        router.refresh();
      } else {
        toast.error('Failed to create agent');
      }
    } catch (e) {
      toast.error('Error creating agent');
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-b">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Agents</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          {isCreating ? 'Cancel' : 'New Agent'}
        </button>
      </div>

      {isCreating && (
        <div className="space-y-3 p-4 bg-white rounded border mb-4 text-black">
          <input
            type="text"
            placeholder="Agent Name (e.g. Coder)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="gpt-4o">OpenAI (gpt-4o)</option>
            <option value="claude-3-5-sonnet-20241022">Claude (3.5 Sonnet)</option>
            <option value="gemini-1.5-pro">Gemini (1.5 Pro)</option>
            <option value="lmstudio">LM Studio (Local)</option>
          </select>
          <textarea
            placeholder="System Prompt (e.g. You are an expert Next.js developer...)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full p-2 border rounded h-24"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Create Agent
          </button>
        </div>
      )}
    </div>
  );
}
