import { IExampleUIUnit } from '@atomic-testing/core';
import { Dropdown, FluentProvider, Option, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const DropdownExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Dropdown data-testid='dropdown-one' placeholder='Pick a fruit'>
      <Option value='apple'>Apple</Option>
      <Option value='banana'>Banana</Option>
      <Option value='cherry' disabled>
        Cherry
      </Option>
      <Option value='date'>Date</Option>
    </Dropdown>
    <Dropdown data-testid='dropdown-two' placeholder='Pick a color'>
      <Option value='red'>Red</Option>
      <Option value='green'>Green</Option>
      <Option value='blue' disabled>
        Blue
      </Option>
      <Option value='yellow'>Yellow</Option>
    </Dropdown>
    <Dropdown data-testid='dropdown-selected' defaultSelectedOptions={['green']} defaultValue='Green'>
      <Option value='red'>Red</Option>
      <Option value='green'>Green</Option>
    </Dropdown>
    <Dropdown data-testid='dropdown-disabled' disabled>
      <Option value='apple'>Apple</Option>
    </Dropdown>
    <Dropdown data-testid='dropdown-unselected'>
      <Option value='apple'>Apple</Option>
      <Option value='banana'>Banana</Option>
    </Dropdown>
  </FluentProvider>
);

export const dropdownUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Dropdown',
  ui: <DropdownExample />,
};
