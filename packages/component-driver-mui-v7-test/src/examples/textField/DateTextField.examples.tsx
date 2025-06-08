import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//#region Label text field
export const DateTextField: React.FunctionComponent = () => {
  return (
    <Box component='form' noValidate autoComplete='off'>
      <TextField data-testid='date' label='Date Field' type='date' variant='outlined' helperText='Enter a date here' />
    </Box>
  );
};

/**
 * Date TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#date-textfield
 */
export const dateTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Date TextField',
  ui: <DateTextField />,
};
//#endregion
