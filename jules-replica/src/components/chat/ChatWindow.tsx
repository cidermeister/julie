'use client';

import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '@/store/settings';
import { useWorkspaceStore } from '@/store/workspace';

interface Message {
  id: string;
  role: string;
  content: string;
  agentName?: string;
}

interface Agent {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
}

export default function ChatWindow({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettingsStore();
  const { repoName, currentBranch } = useWorkspaceStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const loadAgentsAndMessages = async () => {
      const [agentsRes, messagesRes] = await Promise.all([
        fetch('/api/agents'),
        chatId ? fetch(`/api/chats/${chatId}/messages`) : Promise.resolve(null)
      ]);

      const agentsData = await agentsRes.json();
      const messagesData = messagesRes ? await messagesRes.json() : [];

      if (mounted) {
        setAgents(agentsData);
        if (messagesRes) setMessages(messagesData);
      }
    };

    loadAgentsAndMessages();
    return () => { mounted = false; };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const parseTags = (text: string) => {
    const regex = /@(\w+)/g;
    const tags = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      tags.push(match[1]);
    }
    return tags;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    const userMessageContent = input;
    setInput('');

    // Optimistic UI for user message
    const tempUserMsg = { id: Date.now().toString(), role: 'user', content: userMessageContent };
    setMessages(prev => [...prev, tempUserMsg]);

    // Save user message to DB
    await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: userMessageContent }),
    });

    const mentionedAgents = parseTags(userMessageContent);

    // If no agents are mentioned, maybe default to the first agent or just do nothing
    // For this replica, we require tagging an agent if you want a response, or default to the first one
    let agentsToTrigger = agents.filter(a => mentionedAgents.includes(a.name));
    if (agentsToTrigger.length === 0 && agents.length > 0) {
      agentsToTrigger = [agents[0]]; // Default to first agent
    }

    setLoading(true);

    for (const agent of agentsToTrigger) {
      try {
        // We append context info to the system prompt based on the selected workspace
        const contextPrefix = `[Workspace Context: Repo: ${repoName || 'None'}, Branch: ${currentBranch || 'None'}]\n\n`;
        const contextualAgent = {
          ...agent,
          systemPrompt: contextPrefix + agent.systemPrompt
        };

        const aiRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, tempUserMsg].map(m => ({ role: m.role, content: m.content })),
            agent: contextualAgent,
            keys: settings,
          }),
        });

        const aiData = await aiRes.json();

        if (aiData.text) {
          // Save assistant message to DB
          const savedMsgRes = await fetch(`/api/chats/${chatId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'assistant', content: aiData.text, agentName: agent.name }),
          });
          const savedMsg = await savedMsgRes.json();
          setMessages(prev => [...prev, savedMsg]);
        }
      } catch (e) {
        console.error('Error getting response from', agent.name, e);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {m.agentName && <div className="text-xs font-bold text-gray-500 mb-1">{m.agentName}</div>}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg animate-pulse">Agent is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message... use @AgentName to ping a specific agent"
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:border-blue-600"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}
