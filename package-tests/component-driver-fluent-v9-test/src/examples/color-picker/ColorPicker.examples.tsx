import { IExampleUIUnit } from '@atomic-testing/core';
import { ColorArea, ColorPicker, ColorSlider, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * `ColorPicker` is a strictly controlled component (verified against
 * `useColorPicker_unstable`'s source — see `ColorPickerDriver`'s class doc):
 * it has no internal state or `defaultColor` escape hatch, only
 * `color`/`onColorChange`. This example holds `color` in `useState` per
 * instance and updates it from `onColorChange`, exactly like a real consumer
 * would, so the driver's write methods (`setHue`/`setSaturationValue`) have
 * somewhere real to land. Instance A and B start at deliberately different
 * colors so a too-broadly-scoped locator (one that queried the whole
 * document instead of `this.locator`) would be caught immediately.
 *
 * The trailing standalone `ColorSlider`/`ColorArea` (not wrapped in a
 * `ColorPicker`) exercise the "absent" cases a full picker's own children
 * never present on their own: no `aria-label` set anywhere on A/B's parts,
 * and no `disabled`/`required` on them either.
 */
export const ColorPickerExample = () => {
  const [colorA, setColorA] = useState({ h: 0, s: 1, v: 1 });
  const [colorB, setColorB] = useState({ h: 200, s: 0.4, v: 0.6 });

  return (
    <FluentProvider theme={webLightTheme}>
      <ColorPicker data-testid='picker-a' color={colorA} onColorChange={(_event, data) => setColorA(data.color)}>
        <ColorArea />
        <ColorSlider />
      </ColorPicker>

      <ColorPicker data-testid='picker-b' color={colorB} onColorChange={(_event, data) => setColorB(data.color)}>
        <ColorArea />
        <ColorSlider />
      </ColorPicker>

      <ColorSlider data-testid='hue-disabled' disabled />
      <ColorSlider data-testid='hue-required' required aria-label='Hue' />
      <ColorArea data-testid='area-labeled' aria-label='Saturation and brightness' />
    </FluentProvider>
  );
};

export const colorPickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Color Picker',
  ui: <ColorPickerExample />,
};
