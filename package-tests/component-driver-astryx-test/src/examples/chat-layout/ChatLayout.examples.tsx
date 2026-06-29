import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatLayout scene.
 *
 * The root `<div class="astryx-chat-layout">` forwards `data-testid` and carries
 * `data-density`. When `children` is empty the message area renders the caller's
 * `emptyState` node. Both layouts pass `scrollButton={null}` to suppress the
 * default scroll button (it drives `useChatStreamScroll`, a browser-only concern).
 * Two layouts — a populated one (compact density) and an empty one whose
 * `emptyState` node carries its own testid — verify density and the empty-state read.
 */
export const ChatLayoutExample = () => (
  <div>
    <ChatLayout density='compact' scrollButton={null} composer={<div>composer</div>} data-testid='layout-compact'>
      <ChatMessageList>
        <ChatMessage sender='user' name='Alice'>
          <ChatMessageBubble>Hey there!</ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </ChatLayout>
    <ChatLayout
      scrollButton={null}
      composer={<div>composer</div>}
      emptyState={<span data-testid='layout-empty-state'>No messages</span>}
      data-testid='layout-empty'>
      {null}
    </ChatLayout>
  </div>
);

export const chatLayoutUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatLayout',
  ui: <ChatLayoutExample />,
};
