import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx ToggleButtonGroup scene.
 *
 * The group is a `role="group"` root that self-emits `data-testid`; its children
 * are `<button>`s with explicit `aria-label`s and `aria-pressed` state. Single
 * select mode: choosing one releases the others.
 */
export const ToggleButtonGroupExample = () => {
  const [value, setValue] = useState<string | null>('bold');

  return (
    <ToggleButtonGroup label='Format' value={value} onChange={setValue} data-testid='format-group'>
      <ToggleButton label='Bold' value='bold' />
      <ToggleButton label='Italic' value='italic' />
      <ToggleButton label='Underline' value='underline' />
    </ToggleButtonGroup>
  );
};

export const toggleButtonGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ToggleButtonGroup',
  ui: <ToggleButtonGroupExample />,
};
