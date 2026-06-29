import { Citation } from '@astryxdesign/core/Citation';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Citation scene.
 *
 * Citation's root tag is conditional — an `<a>` when its source has a `url`, else
 * a `<span>` — but always carries `role="doc-noteref"`, `aria-label`, `title`, and
 * `data-variant`. The scene renders a linked `label` citation, an unlinked one
 * (source without `url`), and a `number` variant to cover link / no-link / variant.
 */
export const CitationExample = () => (
  <div>
    <Citation
      source={{ title: 'Example Source', url: 'https://example.com' }}
      number={1}
      variant='label'
      data-testid='citation-link'
    />
    <Citation source={{ title: 'Offline Source' }} number={2} variant='label' data-testid='citation-plain' />
    <Citation
      source={{ title: 'Referenced Work', url: 'https://example.org' }}
      number={3}
      variant='number'
      data-testid='citation-number'
    />
  </div>
);

export const citationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Citation',
  ui: <CitationExample />,
};
