import { Markdown } from '@astryxdesign/core/Markdown';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

const blockSource = `# Hello World

This is a [link](https://example.com) and text.

## Resources

See the [API docs](https://example.com/api) for details.

\`\`\`javascript
const x = 1;
\`\`\`

And \`inline code\` here.`;

/**
 * Astryx Markdown scene.
 *
 * Markdown renders its source to native HTML under a root whose shape depends on
 * `display`: a block `<div role="document">` or an inline `<span>` (no role). The
 * `block` instance contains two headings and two links — each link in its own
 * `<p>`, so the two `<a>`s have different parents. That is the case a tag-based
 * `nth-of-type` walk undercounts (every link is the sole `<a>` of its paragraph);
 * the driver counts links/headings by descending through the block wrappers, so
 * `getLinkCount` and `getHeadingCount` are both `2`. The `inline` instance is a
 * single inline span with no heading or link.
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
