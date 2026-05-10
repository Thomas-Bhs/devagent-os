'use client';

import { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useTheme } from './context/ThemeContext';
import { useConversations } from './hooks/useConversations';
import { useAgent } from './hooks/useAgent';
import { AGENTS } from './config/agents';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import ChatMessages from './components/chat/ChatMessages';
import ChatInput from './components/chat/ChatInput';
import SettingsPanel from './components/layout/SettingsPanel';

interface FileContent {
  name: string;
  content: string;
}

export default function Home() {
  const { t } = useTheme();
  const { selectedAgentId, setSelectedAgentId, selectedAgent, agentRoute } = useAgent();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    saveConversation,
    loadConversation,
    deleteConversation,
    deleteAllConversations,
    newConversation,
  } = useConversations();

  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: agentRoute,
    body: { fileContent },
    onError: (error) => {
      console.error('useChat error:', error);
      if (
        error.message.includes('429') ||
        error.message.includes('demo limit') ||
        error.message.includes('rate limit')
      ) {
        setError(
          "You've reached the demo limit of 20 messages. Contact me at bourchisthomas@gmail.com to discuss your project!"
        );
      } else if (error.message.includes('signed in')) {
        setError('You must be signed in to use DevAgent OS.');
      } else if (error.message.includes('403')) {
        setError('Access denied — check your network or disable your VPN.');
      } else {
        setError('An error occurred — please try again.');
      }
    },
  });

  useEffect(() => {
    if (messages.length === 0) return;
    saveConversation(
      activeConversationId,
      messages,
      selectedAgentId,
      selectedAgent?.color || '#6366f1'
    );
  }, [messages]);

  const handleClear = () => {
    setMessages([]);
  };

  const handleNewConversation = () => {
    handleClear();
    newConversation();
    setFileContent(null);
    setError(null);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    if (activeConversationId === id) handleNewConversation();
  };

  const handleDeleteAllConversations = async () => {
    await deleteAllConversations();
    handleNewConversation();
  };

  const handleConversationSelect = async (id: string) => {
    setActiveConversationId(id);
    const msgs = await loadConversation(id);
    if (msgs) setMessages(msgs);
  };

  const handleAgentSelect = (id: string) => {
    setSelectedAgentId(id);
    handleClear();
  };

  return (
    <div className='flex flex-col h-screen' style={{ background: t.bg }}>
      <Topbar
        activeAgents={
          selectedAgent
            ? [{ name: `Agent ${selectedAgent.name}`, hexColor: selectedAgent.color }]
            : []
        }
        onClear={handleClear}
        onSettings={() => setIsSettingsOpen(true)}
        onMenuToggle={() => setIsSidebarOpen(true)}
      />

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          agents={AGENTS}
          selectedAgentId={selectedAgentId}
          conversations={conversations}
          activeConversationId={activeConversationId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onAgentSelect={handleAgentSelect}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onDeleteAllConversations={handleDeleteAllConversations}
        />

        <main className='flex flex-col flex-1 overflow-hidden' style={{ background: t.bg }}>
          <div
            className='flex-1 overflow-hidden flex flex-col mx-4 my-4 rounded-3xl shadow-sm'
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
            }}
          >
            <ChatMessages messages={messages} isLoading={isLoading} agentId={selectedAgentId} />
            {error && (
              <div className='mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between'>
                <p className='text-xs text-red-500'>{error}</p>
                <button
                  onClick={() => setError(null)}
                  aria-label='Close error'
                  className='text-red-300 hover:text-red-500 text-sm ml-3'
                >
                  ×
                </button>
              </div>
            )}
            <ChatInput
              input={input}
              isLoading={isLoading}
              fileContent={fileContent}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onFileChange={setFileContent}
            />
          </div>
        </main>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
