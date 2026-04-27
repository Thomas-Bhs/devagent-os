import { useState, useEffect } from 'react';

export interface Conversation {
  id: string;
  title: string;
  agentName: string;
  agentColor: string;
  date: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState('1');

  useEffect(() => {
    fetch('/api/conversations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setConversations(
            data.map((c) => ({
              id: c.conversationId,
              title: c.title,
              agentName: c.agentId,
              agentColor: c.agentColor,
              date: new Date(c.updatedAt).toLocaleDateString('en-US'),
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  const saveConversation = async (
    conversationId: string,
    messages: { id: string; role: string; content: string }[],
    agentId: string,
    agentColor: string
  ) => {
    if (messages.length === 0) return;
    await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        title: messages[0]?.content?.slice(0, 40) || 'New conversation',
        agentId,
        agentColor,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: new Date(),
        })),
        tokenCount: 0,
        cost: 0,
      }),
    }).catch(console.error);
  };

  const loadConversation = async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`);
    const data = await res.json();
    return data?.messages || [];
  };

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteAllConversations = async () => {
    await fetch('/api/conversations', { method: 'DELETE' });
    setConversations([]);
  };

  const newConversation = () => {
    setActiveConversationId(Date.now().toString());
  };

  return {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    saveConversation,
    loadConversation,
    deleteConversation,
    deleteAllConversations,
    newConversation,
  };
}
