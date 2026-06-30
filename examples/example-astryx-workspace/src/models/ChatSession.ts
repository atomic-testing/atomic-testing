import type { ChatToolCallItem } from '@astryxdesign/core/Chat';

export type ChatSender = 'user' | 'assistant';

export interface ChatMessageModel {
  id: string;
  sender: ChatSender;
  text: string;
  /** Present on assistant replies — the deterministic tool-call group. */
  toolCalls?: ChatToolCallItem[];
}

/**
 * The canned assistant reply. Sending appends the user's message plus this reply —
 * deterministic so the same DOM and E2E assertions hold without a backend. The reply
 * always carries a tool-call group, which `ChatPanelDriver.getToolCallCount()` reads.
 */
export function buildAssistantReply(prompt: string, index: number): ChatMessageModel {
  return {
    id: `assistant-${index}`,
    sender: 'assistant',
    text: `Here's a plan for "${prompt}". I searched a couple of sources first.`,
    toolCalls: [
      { name: 'search', target: 'web', status: 'complete', duration: '0.4s' },
      { name: 'search', target: 'docs', status: 'complete', duration: '0.3s' },
    ],
  };
}

export function buildUserMessage(text: string, index: number): ChatMessageModel {
  return { id: `user-${index}`, sender: 'user', text };
}
