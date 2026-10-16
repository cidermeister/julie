'use client';

import { useState, useEffect } from 'react';
import SettingsModal from '@/components/SettingsModal';
import AgentsManager from '@/components/AgentsManager';
import WorkspaceSelector from '@/components/WorkspaceSelector';
import ChatWindow from '@/components/chat/ChatWindow';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadChats = async () => {
      try {
        const res = await fetch('/api/chats');
        if (!res.ok) throw new Error('Failed to fetch chats');
        const data = await res.json();
        if (mounted) {
          setChats(data);
          if (data.length > 0 && !activeChatId) {
            setActiveChatId(data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadChats();
    return () => { mounted = false; };
  }, [activeChatId]);

  const handleNewChat = async () => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      if (!res.ok) throw new Error('Failed to create chat');
      const chat = await res.json();
      setChats([chat, ...chats]);
      setActiveChatId(chat.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h1 className="font-bold text-xl text-black">Jules Replica</h1>
          <button onClick={() => setShowSettings(true)} className="text-gray-600 hover:text-black">
            ⚙️
          </button>
        </div>

        <WorkspaceSelector />

        <AgentsManager />

        <div className="p-4 border-b">
          <button
            onClick={handleNewChat}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 cursor-pointer border-b text-black truncate ${activeChatId === chat.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChatId ? (
          <ChatWindow chatId={activeChatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select or create a chat to begin
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
