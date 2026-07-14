import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Select, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SelectExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Select data-testid='select-one' defaultValue='a'>
      <option value='a'>A</option>
      <option value='b'>B</option>
    </Select>
    <Select data-testid='select-two' defaultValue='x'>
      <option value='x'>X</option>
      <option value='y'>Y</option>
    </Select>
    <Select data-testid='select-disabled' disabled defaultValue='a'>
      <option value='a'>A</option>
    </Select>
  </FluentProvider>
);

export const selectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Select',
  ui: <SelectExample />,
};
