import { ChatSystemMessage } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatSystemMessage scene.
 *
 * Both variants render a `<div role="status" class="astryx-chat-system-message">`
 * that forwards `data-testid` and carries the stable `data-variant`. Two messages —
 * the plain default and the divider (date-separator) variant — verify text reads
 * and variant disambiguation.
 */
export const ChatSystemMessageExample = () => (
  <div>
    <ChatSystemMessage data-testid='sys-default'>Conversation started</ChatSystemMessage>
    <ChatSystemMessage variant='divider' data-testid='sys-divider'>
      Today
    </ChatSystemMessage>
  </div>
);

export const chatSystemMessageUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatSystemMessage',
  ui: <ChatSystemMessageExample />,
};
