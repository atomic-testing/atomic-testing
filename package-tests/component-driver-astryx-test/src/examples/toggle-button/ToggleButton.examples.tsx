import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx ToggleButton scene.
 *
 * ToggleButton renders a native `<button>` that reports its state via
 * `aria-pressed` and forwards `data-testid` onto it. Each toggle is controlled so
 * `setSelected` (which clicks) flips the rendered `aria-pressed`.
 */
export const ToggleButtonExample = () => {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);

  return (
    <div>
      <ToggleButton label='Bold' isPressed={bold} onPressedChange={setBold} data-testid='bold-toggle' />
      <ToggleButton label='Italic' isPressed={italic} onPressedChange={setItalic} data-testid='italic-toggle' />
    </div>
  );
};

export const toggleButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ToggleButton',
  ui: <ToggleButtonExample />,
};
