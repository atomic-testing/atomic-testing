import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx CodeBlock scene.
 *
 * CodeBlock renders a `<pre data-language>` root (with `data-testid`) around a
 * `<code>` whose lines are `<div data-line>`. The `basic` instance shows a
 * language label and copy button; the `collapsible` instance sets a low threshold
 * so it renders the `role="button"` collapse header (starting collapsed).
 *
 * The `large` instance has 150 lines — above Astryx's `LINE_CHUNK_THRESHOLD` (100),
 * where the `<div data-line>` markers are wrapped in 20-line chunk `<div>`s instead
 * of being flat children of `<code>`. A tag-based `nth-of-type` walk stops at the
 * first chunk boundary (reporting 20); the driver descends through the chunk
 * wrappers, so `getLineCount` is the full `150`.
 */
const largeCode = Array.from({ length: 150 }, (_, i) => `const v${i} = ${i};`).join('\n');

export const CodeBlockExample = () => (
  <div>
    <CodeBlock
      code={'const x = 1;\nconst y = 2;'}
      language='javascript'
      hasCopyButton
      hasLanguageLabel
      data-testid='codeblock-basic'
    />
    <CodeBlock
      code={'line1\nline2\nline3'}
      language='text'
      isCollapsible
      collapsibleThreshold={1}
      data-testid='codeblock-collapsible'
    />
    <CodeBlock code={largeCode} language='javascript' data-testid='codeblock-large' />
  </div>
);

export const codeBlockUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CodeBlock',
  ui: <CodeBlockExample />,
};
