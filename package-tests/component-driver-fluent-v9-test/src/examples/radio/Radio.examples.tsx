import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Radio, RadioGroup, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const RadioExample = () => (
  <FluentProvider theme={webLightTheme}>
    <RadioGroup data-testid='radio-group' defaultValue='1'>
      <Radio data-testid='radio-one' value='1' label='One' />
      <Radio data-testid='radio-two' value='2' label='Two' />
      <Radio data-testid='radio-unlabeled' value='3' />
    </RadioGroup>
    <RadioGroup data-testid='radio-group-disabled' defaultValue='1' disabled>
      <Radio data-testid='radio-disabled' value='1' label='Disabled' />
    </RadioGroup>
  </FluentProvider>
);

export const radioUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent RadioGroup',
  ui: <RadioExample />,
};
