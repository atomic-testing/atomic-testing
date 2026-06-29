import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatMessageList scene.
 *
 * The list root is a `<div role="log" class="astryx-chat-message-list">` that
 * forwards `data-testid` and carries `data-density`. Messages are
 * `<article class="astryx-chat-message">` descendants the driver enumerates. Two
 * lists — a populated one (compact density, two messages) and an empty one whose
 * `emptyState` node carries its own testid — verify counting, density, and the
 * empty-state read.
 */
export const ChatMessageListExample = () => (
  <div>
    <ChatMessageList density='compact' data-testid='list-full'>
      <ChatMessage sender='user' name='Alice'>
        <ChatMessageBubble>Hey there!</ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender='assistant' name='Navi'>
        <ChatMessageBubble>How can I help?</ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
    <ChatMessageList data-testid='list-empty' emptyState={<span data-testid='list-empty-state'>Start chatting!</span>}>
      {null}
    </ChatMessageList>
  </div>
);

export const chatMessageListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatMessageList',
  ui: <ChatMessageListExample />,
};
