import { ChatComposerInput } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatComposerInput scene.
 *
 * The editor is a `contenteditable` `div[role="textbox"]`, not an `<input>`. The
 * driver reads the accessible name (`aria-label` from `label`), the placeholder
 * (an `aria-hidden` sibling, not the native attribute), and the suggestion menu's
 * closed `aria-expanded`. `data-testid` is forwarded onto the root (a `data-*`
 * attribute allowed by Astryx's BaseProps), so the scene anchors there.
 */
export const ChatComposerInputExample = () => (
  <ChatComposerInput label='Message input' placeholder='Type a message…' data-testid='cci' />
);

export const chatComposerInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatComposerInput',
  ui: <ChatComposerInputExample />,
};
