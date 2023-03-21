import { SwitchDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Stack, Switch } from '@mui/material';
import React from 'react';

//#region switch
export const BasicSwitch: React.FunctionComponent = () => {
  return (
    <Stack direction="column">
      <Switch data-testid="default-checked" defaultChecked />
      <Switch data-testid="default-unchecked" />
      <Switch data-testid="disabled" disabled />
    </Stack>
  );
};

export const basicSwitchExampleScenePart = {
  checked: {
    locator: byDataTestId('default-checked'),
    driver: SwitchDriver,
  },
  unchecked: {
    locator: byDataTestId('default-unchecked'),
    driver: SwitchDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: SwitchDriver,
  },
} satisfies ScenePart;

/**
 * Basic Switch example from MUI's website
 * @see https://mui.com/material-ui/react-switch
 */
export const basicSwitchExample: IExampleUnit<typeof basicSwitchExampleScenePart, JSX.Element> = {
  title: 'Basic Switch',
  scene: basicSwitchExampleScenePart,
  ui: <BasicSwitch />,
};
//#endregion

export const switchExamples = [basicSwitchExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
