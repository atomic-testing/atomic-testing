import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import styled from '@emotion/styled';
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

//#region Readonly and disabled TextField
const ExampleLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
`;
export const ReadonlyAndDisabledTextField = () => {
  return (
    <ExampleLayout>
      <TextField disabled data-testid="text-disabled" label="Disabled" defaultValue="Hello World" />
      <TextField
        data-testid="text-readonly"
        label="Read Only"
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        disabled
        data-testid="multiline-disabled"
        label="Disabled"
        multiline
        rows={3}
        defaultValue="Hello World"
      />
      <TextField
        data-testid="multiline-readonly"
        label="Read Only"
        multiline
        rows={3}
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField disabled data-testid="select-disabled" label="Disabled" select defaultValue="60">
        {selectTextFieldExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        data-testid="select-readonly"
        label="Read Only"
        select
        defaultValue="20"
        InputProps={{
          readOnly: true,
        }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        disabled
        data-testid="native-select-disabled"
        label="Native Disabled"
        select
        defaultValue="60"
        SelectProps={{ native: true }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        data-testid="native-select-readonly"
        label="Native Read Only"
        select
        defaultValue="20"
        SelectProps={{ native: true, readOnly: true }}
      >
        {selectTextFieldExampleData.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </ExampleLayout>
  );
};

export const readonlyAndDisabledTextFieldExampleScenePart = {
  textDisabled: {
    locator: byDataTestId('text-disabled'),
    driver: TextFieldDriver,
  },
  textReadonly: {
    locator: byDataTestId('text-readonly'),
    driver: TextFieldDriver,
  },
  multilineDisabled: {
    locator: byDataTestId('multiline-disabled'),
    driver: TextFieldDriver,
  },
  multilineReadonly: {
    locator: byDataTestId('multiline-readonly'),
    driver: TextFieldDriver,
  },
  selectDisabled: {
    locator: byDataTestId('select-disabled'),
    driver: TextFieldDriver,
  },
  selectReadonly: {
    locator: byDataTestId('select-readonly'),
    driver: TextFieldDriver,
  },
  nativeSelectDisabled: {
    locator: byDataTestId('native-select-disabled'),
    driver: TextFieldDriver,
  },
  nativeSelectReadonly: {
    locator: byDataTestId('native-select-readonly'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const readonlyAndDisabledTextFieldExample: IExampleUnit<
  typeof readonlyAndDisabledTextFieldExampleScenePart,
  JSX.Element
> = {
  title: 'Readonly & Disabled TextField',
  scene: readonlyAndDisabledTextFieldExampleScenePart,
  ui: <ReadonlyAndDisabledTextField />,
};
//#endregion

export const textFieldExamples = [
  basicTextFieldExample,
  multilineTextFieldExample,
  selectTextFieldExample,
  readonlyAndDisabledTextFieldExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
