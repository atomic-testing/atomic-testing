import { ChatComposer } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatComposer scene.
 *
 * ChatComposer wraps a contenteditable editor, a send/stop button, and an optional
 * status message. The driver reads the root's `data-density` (default `'balanced'`),
 * the send button's `disabled`/`aria-label` (Send↔Stop), and the `role="alert"`
 * status text — all jsdom-faithful. `onSubmit` is required; `data-testid` is
 * forwarded onto the root, so the scene anchors there.
 *
 * Two instances: an idle composer (empty → send disabled) and one showing the stop
 * button alongside an error status.
 */
export const ChatComposerExample = () => (
  <div>
    <ChatComposer placeholder='Message…' onSubmit={() => {}} data-testid='cc-idle' />
    <ChatComposer
      isStopShown
      status={{ type: 'error', message: 'Connection lost' }}
      onSubmit={() => {}}
      data-testid='cc-stop'
    />
  </div>
);

export const chatComposerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatComposer',
  ui: <ChatComposerExample />,
};
