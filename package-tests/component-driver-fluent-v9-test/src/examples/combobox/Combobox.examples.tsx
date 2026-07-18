import { IExampleUIUnit } from '@atomic-testing/core';
import { Combobox, FluentProvider, Option, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * `combobox-pair-a`/`combobox-pair-b` are forced permanently open (`open`
 * without a state-updating `onOpenChange`, so Fluent's `useControllableState`
 * treats `open` as fully controlled and pinned to `true` — DOM audit). This
 * is required, not decorative: Fluent's `Combobox` closes any OTHER open
 * combobox on click-outside (verified against rendered DOM — clicking a
 * sibling combobox's trigger closes an uncontrolled one that was open), so
 * two default/uncontrolled instances can never be observed open at the same
 * time via sequential clicks. Pinning both open lets the two-instance
 * disambiguation test prove the listbox-resolution locator is scoped per
 * instance (a too-broad locator would resolve both drivers to the SAME
 * mounted listbox here).
 */
export const ComboboxExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Combobox data-testid='combobox-animals' placeholder='Choose an animal'>
      <Option>Cat</Option>
      <Option>Dog</Option>
      <Option>Bird</Option>
      <Option disabled>Fish</Option>
    </Combobox>

    <Combobox data-testid='combobox-empty' placeholder='No options' />

    <Combobox data-testid='combobox-disabled' disabled placeholder='Disabled'>
      <Option>Only option</Option>
    </Combobox>

    <Combobox data-testid='combobox-pair-a' open onOpenChange={() => {}} placeholder='Pair A'>
      <Option>Alpha</Option>
      <Option>Beta</Option>
    </Combobox>

    <Combobox data-testid='combobox-pair-b' open onOpenChange={() => {}} placeholder='Pair B'>
      <Option>Gamma</Option>
      <Option>Delta</Option>
      <Option>Epsilon</Option>
    </Combobox>
  </FluentProvider>
);

export const comboboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Combobox',
  ui: <ComboboxExample />,
};
