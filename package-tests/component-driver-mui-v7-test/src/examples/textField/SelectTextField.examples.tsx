import { JSX } from 'react';
import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

//#region Select TextField
export const selectTextFieldExampleData = {
  options: [
    { value: '20', label: 'Twenty' },
    { value: '30', label: 'Thirty' },
    { value: '60', label: 'Sixty' },
  ],
};

export const SelectTextField = () => {
  return (
    <Box>
      <TextField data-testid='select' select label='Number' defaultValue='30' helperText='Please select your number'>
        {selectTextFieldExampleData.options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export const selectTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Select TextField',
  ui: <SelectTextField />,
};
//#endregion
