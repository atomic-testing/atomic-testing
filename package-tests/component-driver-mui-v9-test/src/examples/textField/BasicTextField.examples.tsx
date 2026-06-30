import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from 'react';

//#region Label text field
export const BasicTextField: React.FunctionComponent = () => {
  return (
    <Box component='form' noValidate autoComplete='off'>
      <TextField data-testid='basic' label='Basic Field' variant='outlined' helperText='Enter text here' />
    </Box>
  );
};

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic TextField',
  ui: <BasicTextField />,
};
//#endregion
