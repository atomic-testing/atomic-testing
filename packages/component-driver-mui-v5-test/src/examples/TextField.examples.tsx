import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Box, MenuItem, TextField } from '@mui/material';
import React from 'react';

//#region Label checkbox
export const BasicTextField: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField data-testid="basic" label="Basic Field" variant="outlined" helperText="Enter text here" />
    </Box>
  );
};

export const basicTextFieldExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicTextFieldExample: IExampleUnit<typeof basicTextFieldExampleScenePart, JSX.Element> = {
  title: 'Basic TextField',
  scene: basicTextFieldExampleScenePart,
  ui: <BasicTextField />,
};
//#endregion

//#region Multiline TextField
export const MultilineTextField = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField data-testid="multiline" label="Multiline" multiline rows={4} defaultValue="Default Value" />
    </Box>
  );
};

export const multilineTextFieldExampleScenePart = {
  multiline: {
    locator: byDataTestId('multiline'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Multiline TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#multiline
 */
export const multilineTextFieldExample: IExampleUnit<typeof multilineTextFieldExampleScenePart, JSX.Element> = {
  title: 'Multiline TextField',
  scene: multilineTextFieldExampleScenePart,
  ui: <MultilineTextField />,
};
//#endregion

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
      <TextField data-testid="select" select label="Number" defaultValue="30" helperText="Please select your number">
        {selectTextFieldExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export const selectTextFieldExampleScenePart = {
  select: {
    locator: byDataTestId('select'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const selectTextFieldExample: IExampleUnit<typeof selectTextFieldExampleScenePart, JSX.Element> = {
  title: 'Select TextField',
  scene: selectTextFieldExampleScenePart,
  ui: <SelectTextField />,
};
//#endregion

export const textFieldExamples = [
  basicTextFieldExample,
  multilineTextFieldExample,
  selectTextFieldExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
