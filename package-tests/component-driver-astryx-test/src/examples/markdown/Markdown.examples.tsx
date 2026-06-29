import { Markdown } from '@astryxdesign/core/Markdown';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

const blockSource = `# Hello World

This is a [link](https://example.com) and text.

\`\`\`javascript
const x = 1;
\`\`\`

And \`inline code\` here.`;

/**
 * Astryx Markdown scene.
 *
 * Markdown renders its source to native HTML under a root whose shape depends on
 * `display`: a block `<div role="document">` or an inline `<span>` (no role). The
 * `block` instance contains a heading, a link, and a fenced code block; the
 * `inline` instance is a single inline span with no heading or link.
 */
export const MarkdownExample = () => (
  <div>
    <Markdown data-testid='markdown-block'>{blockSource}</Markdown>
    <Markdown display='inline' data-testid='markdown-inline'>
      Inline **bold** and `code`.
    </Markdown>
  </div>
);

export const markdownUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Markdown',
  ui: <MarkdownExample />,
};
