import { ChatMessage, ChatMessageBubble, ChatMessageMetadata } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatMessage scene.
 *
 * Each message is an `<article class="astryx-chat-message">` carrying `data-sender`
 * and `data-density`, forwarding `data-testid` onto the root. The bubble
 * (`.astryx-chat-message-bubble`) and metadata (`.astryx-chat-message-metadata`)
 * are descendants the driver reads by their stable semantic classes. Two messages
 * — user (compact density, with metadata) and assistant — verify sender/density
 * disambiguation and the absent-metadata case.
 */
export const ChatMessageExample = () => (
  <div>
    <ChatMessage sender='user' name='Alice' density='compact' data-testid='msg-user'>
      <ChatMessageBubble>Hey there!</ChatMessageBubble>
      <ChatMessageMetadata timestamp='2:30 PM' />
    </ChatMessage>
    <ChatMessage sender='assistant' name='Navi' data-testid='msg-assistant'>
      <ChatMessageBubble>How can I help?</ChatMessageBubble>
    </ChatMessage>
  </div>
);

export const chatMessageUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatMessage',
  ui: <ChatMessageExample />,
};
