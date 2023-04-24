import { AutoCompleteDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { top100Films } from './data';

//#region Label AutoComplete
export const BasicAutoComplete: React.FunctionComponent = () => {
  return (
    <Autocomplete
      data-testid="basic-auto-complete"
      disablePortal
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
};

export const basicAutoCompleteExampleScenePart = {
  basic: {
    locator: byDataTestId('basic-auto-complete'),
    driver: AutoCompleteDriver,
  },
} satisfies ScenePart;

/**
 * Basic AutoComplete example from MUI's website
 * @see https://mui.com/material-ui/react-autocomplete/#combo-box
 */
export const basicAutoCompleteExample: IExampleUnit<typeof basicAutoCompleteExampleScenePart, JSX.Element> = {
  title: 'Basic AutoComplete',
  scene: basicAutoCompleteExampleScenePart,
  ui: <BasicAutoComplete />,
};
//#endregion

export const basicAutoCompleteTestSuite: TestSuiteInfo<typeof basicAutoCompleteExampleScenePart> = {
  title: 'Basic AutoComplete',
  url: '/AutoComplete',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAutoCompleteExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAutoCompleteExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });
  },
};
