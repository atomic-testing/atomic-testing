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
 */
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
  </div>
);

export const codeBlockUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CodeBlock',
  ui: <CodeBlockExample />,
};
