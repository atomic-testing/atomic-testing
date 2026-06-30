import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import React from 'react';

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
