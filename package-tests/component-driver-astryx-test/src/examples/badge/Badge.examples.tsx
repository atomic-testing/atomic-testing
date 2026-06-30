import { Badge } from '@astryxdesign/core/Badge';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Badge scene.
 *
 * Badge renders a single `<span>` (no role) whose `variant` is reflected as
 * `data-variant` and whose `label` is the text content. Two instances with
 * distinct variants exercise reads and disambiguation.
 */
export const BadgeExample = () => (
  <div>
    <Badge variant='success' label='Active' data-testid='badge-success' />
    <Badge variant='purple' label='Engineering' data-testid='badge-purple' />
  </div>
);

export const badgeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Badge',
  ui: <BadgeExample />,
};
