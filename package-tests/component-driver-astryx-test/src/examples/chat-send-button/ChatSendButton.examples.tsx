import { ChatSendButton } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatSendButton scene.
 *
 * ChatSendButton renders an icon-only `<button class="astryx-chat-send-button">`
 * but does NOT forward `data-testid` (it spreads props onto an inner `Button`), so
 * each instance is wrapped in a `data-testid` `<div>` the scene scopes through. The
 * button's state shows as the verbatim `aria-label` (`"Send"` vs `"Stop"`) and, for
 * the send state, the native `disabled` attribute. Three instances — an enabled
 * send, a disabled send, and a stop — provide that disambiguation.
 */
export const ChatSendButtonExample = () => (
  <div>
    <div data-testid='send-enabled'>
      {/* isDisabled defaults to !canSend from composer context; standalone that is
          `true`, so an enabled send button must opt out explicitly. */}
      <ChatSendButton onSend={() => {}} isDisabled={false} />
    </div>
    <div data-testid='send-disabled'>
      <ChatSendButton onSend={() => {}} isDisabled />
    </div>
    <div data-testid='send-stop'>
      <ChatSendButton isStopShown onStop={() => {}} />
    </div>
  </div>
);

export const chatSendButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatSendButton',
  ui: <ChatSendButtonExample />,
};
