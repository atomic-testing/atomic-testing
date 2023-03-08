import { NativeSelectDriver, SelectDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Box, FormControl, InputLabel, MenuItem, NativeSelect, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react';

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
        <InputLabel id="simple-select-label">Age</InputLabel>
        <Select data-testid="simple-select" label="Age" labelId="simple-select-label" value={value} onChange={onChange}>
          {basicSelectExampleData.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export const basicSelectExampleScenePart = {
  select: {
    locator: byDataTestId('simple-select'),
    driver: SelectDriver,
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
//#endregion

//#region Native select
export const NativeSelectExample = () => (
  <FormControl fullWidth>
    <InputLabel variant="standard" htmlFor="uncontrolled-native">
      Age
    </InputLabel>
    <NativeSelect
      data-testid="native-select"
      defaultValue={30}
      inputProps={{
        name: 'age',
        id: 'uncontrolled-native',
      }}
    >
      <option value={10}>Ten</option>
      <option value={20}>Twenty</option>
      <option value={30}>Thirty</option>
    </NativeSelect>
  </FormControl>
);

export const nativeSelectExampleScenePart = {
  select: {
    locator: byDataTestId('native-select'),
    driver: NativeSelectDriver,
  },
} satisfies ScenePart;

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const nativeSelectExample: IExampleUnit<typeof nativeSelectExampleScenePart, JSX.Element> = {
  title: 'Native Select',
  scene: nativeSelectExampleScenePart,
  ui: <NativeSelectExample />,
};
//#endregion

export const selectExamples = [basicSelectExample, nativeSelectExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
