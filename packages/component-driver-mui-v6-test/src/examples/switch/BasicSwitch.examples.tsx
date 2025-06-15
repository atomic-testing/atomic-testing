import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

//#region Example
export const BasicSwitch: React.FunctionComponent = () => {
  return (
    <Stack direction='column'>
      <Switch data-testid='default-checked' defaultChecked />
      <Switch data-testid='default-unchecked' />
      <Switch data-testid='disabled' disabled />
    </Stack>
  );
};

/**
 * Basic Switch example from MUI's website
 * @see https://mui.com/material-ui/react-switch
 */
export const basicSwitchUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Switch',
  ui: <BasicSwitch />,
};
//#endregion
