import { IExampleUIUnit } from '@atomic-testing/core';
import { ScrollArea } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix ScrollArea audit scene (Wave 0 capability-gap audit; no driver yet).
 *
 * Inline sizing only — the viewport must be smaller than its content for any
 * scrolling behavior to exist in a browser.
 */
export const ScrollAreaExample = () => (
  <ScrollArea.Root data-testid='scroll-area' type='always' style={{ width: 200, height: 100, overflow: 'hidden' }}>
    <ScrollArea.Viewport data-testid='scroll-area-viewport' style={{ width: '100%', height: '100%' }}>
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} data-testid={`scroll-area-row-${i}`}>
            Row {i}
          </div>
        ))}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      orientation='vertical'
      data-testid='scroll-area-scrollbar'
      style={{ display: 'flex', width: 8, backgroundColor: '#eee' }}>
      <ScrollArea.Thumb style={{ flex: 1, backgroundColor: '#888' }} />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
);

export const scrollAreaUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix ScrollArea',
  ui: <ScrollAreaExample />,
};
