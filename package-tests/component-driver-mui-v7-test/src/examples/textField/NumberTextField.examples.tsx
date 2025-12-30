import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//#region Label text field
export const NumberTextField: React.FunctionComponent = () => {
  const [value, setValue] = React.useState('');
  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);
  return (
    <Box component='form' noValidate autoComplete='off'>
      <TextField
        data-testid='number'
        label='Number'
        type='number'
        variant='outlined'
        helperText='Enter number here'
        onChange={handleChange}
      />
      <span data-testid='display'>{value}</span>
    </Box>
  );
};

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const numberTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Number TextField',
  ui: <NumberTextField />,
};
//#endregion
