import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';

//#region Example
export const BasicInput: React.FunctionComponent = () => {
  return (
    <Box component='form' noValidate autoComplete='off' gap='2rem' display='flex' alignItems='flex-start'>
      <FilledInput data-testid='basic' />
      <FilledInput data-testid='readonly' readOnly />
      <FilledInput data-testid='disabled' disabled />
      <OutlinedInput data-testid='multiline' multiline rows={5} />
    </Box>
  );
};

export const basicInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Input',
  ui: <BasicInput />,
};
//#endregion
