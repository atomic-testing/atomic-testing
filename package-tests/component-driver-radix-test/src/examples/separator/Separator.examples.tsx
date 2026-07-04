import { IExampleUIUnit } from '@atomic-testing/core';
import { Separator } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Separator scene.
 *
 * `Separator.Root` renders a single `<div>` carrying `data-orientation` always,
 * `role="separator"` when semantic, and `role="none"` when `decorative`. The
 * three instances cover both orientations and the decorative case, so a
 * too-broad locator or read shows up as cross-instance bleed.
 */
export const SeparatorExample = () => (
  <div>
    <span>above</span>
    <Separator.Root data-testid='separator-horizontal' style={{ height: 1, backgroundColor: 'gray' }} />
    <span style={{ display: 'inline-flex', height: 16, alignItems: 'center', gap: 8 }}>
      left
      <Separator.Root
        orientation='vertical'
        data-testid='separator-vertical'
        style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'gray' }}
      />
      right
    </span>
    <Separator.Root decorative data-testid='separator-decorative' style={{ height: 1, backgroundColor: 'gray' }} />
  </div>
);

export const separatorUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Separator',
  ui: <SeparatorExample />,
};
