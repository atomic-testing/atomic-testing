import { ChatMessage, ChatMessageBubble } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatMessageBubble scene.
 *
 * Each bubble renders a `<div class="astryx-chat-message-bubble">` that forwards
 * `data-testid` and reflects its props as `data-sender` (inherited from the
 * enclosing `ChatMessage`, or `assistant` when standalone), `data-variant`
 * (`filled` | `ghost`), and `data-density`. Three bubbles — a filled user bubble,
 * a standalone (default assistant) filled bubble, and a ghost bubble — verify
 * sender and variant disambiguation.
 */
export const ChatMessageBubbleExample = () => (
  <div>
    <ChatMessage sender='user' density='compact'>
      <ChatMessageBubble data-testid='bubble-user'>Hey there!</ChatMessageBubble>
    </ChatMessage>
    <ChatMessageBubble data-testid='bubble-standalone'>Standalone reply</ChatMessageBubble>
    <ChatMessageBubble variant='ghost' data-testid='bubble-ghost'>
      Ghost content
    </ChatMessageBubble>
  </div>
);

export const chatMessageBubbleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatMessageBubble',
  ui: <ChatMessageBubbleExample />,
};
