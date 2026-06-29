import { ChatToolCalls } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatToolCalls scene.
 *
 * The root `<div class="astryx-chat-tool-calls">` forwards `data-testid`. A single
 * call renders one inline row with no group chrome; multiple calls render a
 * collapsible `<div role="button" aria-expanded>` header over a body that always
 * keeps every row in the DOM. Two blocks — a single call and a four-call group
 * (collapsed by default, since `defaultIsExpanded` is false for >3) — verify
 * counting, the single-vs-group distinction, and the expand toggle.
 */
export const ChatToolCallsExample = () => (
  <div>
    <ChatToolCalls
      data-testid='tool-single'
      calls={[{ name: 'read_file', target: 'Button.tsx', status: 'complete', duration: '1.2s' }]}
    />
    <ChatToolCalls
      data-testid='tool-multi'
      calls={[
        { name: 'read_file', target: 'Button.tsx', status: 'complete', duration: '1.2s' },
        { name: 'edit_file', target: 'Button.tsx', status: 'complete', duration: '0.8s' },
        { name: 'run_tests', target: 'yarn test', status: 'complete', duration: '4.1s' },
        { name: 'commit', target: 'main', status: 'complete', duration: '0.3s' },
      ]}
    />
  </div>
);

export const chatToolCallsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatToolCalls',
  ui: <ChatToolCallsExample />,
};
