import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { buildAssistantReply, buildUserMessage, ChatMessageModel } from '../models/ChatSession';
import { defaultSettings } from '../models/SettingsModel';

interface ChatSession {
  messages: ChatMessageModel[];
  model: string;
  send: (text: string) => void;
  clear: () => void;
  selectModel: (model: string) => void;
}

const ChatSessionContext = createContext<ChatSession | null>(null);

/**
 * Holds the chat transcript and selected model. Lifted above the routes so the
 * command palette ("New chat", "Clear chat") and the chat panel share one session.
 * Replies are a deterministic client-side mock — no backend.
 */
export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [model, setModel] = useState<string>(defaultSettings.model);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return;
    }
    setMessages(prev => {
      const turn = prev.length;
      return [...prev, buildUserMessage(trimmed, turn), buildAssistantReply(trimmed, turn + 1)];
    });
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  const value = useMemo<ChatSession>(
    () => ({ messages, model, send, clear, selectModel: setModel }),
    [messages, model, send, clear]
  );

  return <ChatSessionContext.Provider value={value}>{children}</ChatSessionContext.Provider>;
}

export function useChatSession(): ChatSession {
  const ctx = useContext(ChatSessionContext);
  if (ctx == null) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return ctx;
}
