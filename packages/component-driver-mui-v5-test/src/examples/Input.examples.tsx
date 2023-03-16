import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Box, FilledInput } from '@mui/material';
import React from 'react';

//#region Label checkbox
export const BasicInput: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <FilledInput data-testid="basic" />
      <FilledInput data-testid="readonly" readOnly />
      <FilledInput data-testid="disabled" disabled />
    </Box>
  );
};

export const basicInputExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: TextFieldDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: TextFieldDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicInputExample: IExampleUnit<typeof basicInputExampleScenePart, JSX.Element> = {
  title: 'Basic TextField',
  scene: basicInputExampleScenePart,
  ui: <BasicInput />,
};
//#endregion

export const inputExamples = [basicInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
