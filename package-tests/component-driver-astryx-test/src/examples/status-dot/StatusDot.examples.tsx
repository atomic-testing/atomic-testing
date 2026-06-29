import { StatusDot } from '@astryxdesign/core/StatusDot';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx StatusDot scene.
 *
 * StatusDot renders a single `<span role="img">` whose accessible name is the
 * verbatim `aria-label` (from `label`) and whose severity lives in `data-variant`.
 * Two instances disambiguate the by-testid anchoring.
 */
export const StatusDotExample = () => (
  <div>
    <StatusDot variant='success' label='Online' data-testid='status-dot-1' />
    <StatusDot variant='error' label='Offline' data-testid='status-dot-2' />
  </div>
);

export const statusDotUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx StatusDot',
  ui: <StatusDotExample />,
};
