import { SelectComponentDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react';

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
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select data-testid="demo-simple-select" labelId="demo-simple-select-label" value={value} onChange={onChange}>
        {basicSelectExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const basicSelectExampleScenePart = {
  select: {
    locator: byDataTestId('demo-simple-select'),
    driver: SelectComponentDriver,
  },
} satisfies ScenePart;

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const basicSelectExample: IExampleUnit<typeof basicSelectExampleScenePart, JSX.Element> = {
  title: 'Basic Select',
  scene: basicSelectExampleScenePart,
  ui: <BasicSelectExample />,
};

export const selectExamples = [basicSelectExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
