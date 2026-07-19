import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, SpinButton, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SpinButtonExample = () => (
  <FluentProvider theme={webLightTheme}>
    <SpinButton data-testid='spinbutton-a' defaultValue={5} min={0} max={10} step={1} stepPage={5} />
    <SpinButton data-testid='spinbutton-b' defaultValue={50} min={20} max={100} step={5} stepPage={20} />
    <SpinButton data-testid='spinbutton-disabled' defaultValue={3} min={0} max={10} disabled />
    <SpinButton data-testid='spinbutton-required' defaultValue={1} min={0} max={10} required />
    <SpinButton data-testid='spinbutton-readonly' defaultValue={4} min={0} max={10} readOnly />
    <SpinButton data-testid='spinbutton-invalid' defaultValue={2} min={0} max={10} aria-invalid />
  </FluentProvider>
);

export const spinButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent SpinButton',
  ui: <SpinButtonExample />,
};
