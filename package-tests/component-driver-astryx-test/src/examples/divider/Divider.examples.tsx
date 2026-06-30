import { Divider } from '@astryxdesign/core/Divider';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Divider scene.
 *
 * Divider renders a `<div role="separator">` carrying `data-variant` and
 * `data-orientation`. A labeled divider renders three inner `<div>`s
 * (line | label | line); an unlabeled one renders a single inner `<div>`. The two
 * instances cover the labeled and unlabeled (label → `undefined`) cases.
 */
export const DividerExample = () => (
  <div>
    <Divider variant='subtle' label='or' data-testid='divider-labeled' />
    <Divider variant='strong' data-testid='divider-plain' />
  </div>
);

export const dividerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Divider',
  ui: <DividerExample />,
};
