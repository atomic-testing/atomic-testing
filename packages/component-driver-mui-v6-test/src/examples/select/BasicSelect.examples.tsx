import React, { useCallback } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

//#region Basic select
export const basicSelectExampleData = {
  options: [
    { value: '20', label: 'Twenty' },
    { value: '30', label: 'Thirty' },
    { value: '60', label: 'Sixty' },
  ],
};

export const BasicSelectExample = () => {
  const [value, setValue] = React.useState('');
  const onChange = useCallback((event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
  }, []);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='simple-select-label'>Age</InputLabel>
        <Select data-testid='simple-select' label='Age' labelId='simple-select-label' value={value} onChange={onChange}>
          {basicSelectExampleData.options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const basicSelectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Select',
  ui: <BasicSelectExample />,
};
//#endregion
