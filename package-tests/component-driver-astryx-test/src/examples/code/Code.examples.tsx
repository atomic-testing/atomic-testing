import { Code } from '@astryxdesign/core/Code';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Code scene.
 *
 * Code renders an inline `<code class="astryx-code">` (no role, no theme `data-*`).
 * Two instances exercise the text read and disambiguation.
 */
export const CodeExample = () => (
  <div>
    <Code data-testid='code-1'>const x = 1</Code>
    <Code data-testid='code-2'>npm install</Code>
  </div>
);

export const codeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Code',
  ui: <CodeExample />,
};
