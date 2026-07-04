import { IExampleUIUnit } from '@atomic-testing/core';
import { Label, Switch } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Switch scene: a labeled switch (native `<label for>`↔`id` link) plus a
 * disabled one, covering the checked/label/disabled reads per instance.
 */
export const SwitchExample = () => (
  <div>
    <div>
      <Label.Root htmlFor='notifications'>Notifications</Label.Root>
      <Switch.Root id='notifications' data-testid='switch-labeled' defaultChecked={false}>
        <Switch.Thumb />
      </Switch.Root>
    </div>
    <div>
      <Switch.Root data-testid='switch-disabled' disabled defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
    </div>
  </div>
);

export const switchUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Switch',
  ui: <SwitchExample />,
};
