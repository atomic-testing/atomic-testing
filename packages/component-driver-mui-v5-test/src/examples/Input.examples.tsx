import { InputDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Box, FilledInput, OutlinedInput } from '@mui/material';
import React from 'react';

//#region Label checkbox
export const BasicInput: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off" gap="2rem" display="flex" alignItems="flex-start">
      <FilledInput data-testid="basic" />
      <FilledInput data-testid="readonly" readOnly />
      <FilledInput data-testid="disabled" disabled />
      <OutlinedInput data-testid="multiline" multiline rows={5} />
    </Box>
  );
};

export const basicInputExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: InputDriver,
  },
  multiline: {
    locator: byDataTestId('multiline'),
    driver: InputDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: InputDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: InputDriver,
  },
} satisfies ScenePart;

export const basicInputExample: IExampleUnit<typeof basicInputExampleScenePart, JSX.Element> = {
  title: 'Basic TextField',
  scene: basicInputExampleScenePart,
  ui: <BasicInput />,
};
//#endregion

export const inputExamples = [basicInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
