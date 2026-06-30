import { Text } from '@astryxdesign/core/Text';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Text scene.
 *
 * Text renders a single element (no role) reflecting the semantic `type` as
 * `data-type` and the RESOLVED color as `data-color`. The `supporting` instance
 * resolves to `data-color="secondary"` with no explicit `color` prop, exercising
 * the resolved-color read alongside the `body`/`primary` default.
 */
export const TextExample = () => (
  <div>
    <Text type='body' data-testid='text-body'>
      Body text
    </Text>
    <Text type='supporting' data-testid='text-supporting'>
      Supporting text
    </Text>
  </div>
);

export const textUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Text',
  ui: <TextExample />,
};
