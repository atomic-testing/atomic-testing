import React from 'react';

import { SwitchDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

//#region Example
export const BasicSwitch: React.FunctionComponent = () => {
  return (
    <Stack direction='column'>
      <Switch data-testid='default-checked' defaultChecked />
      <Switch data-testid='default-unchecked' />
      <Switch data-testid='disabled' disabled />
    </Stack>
  );
};

export const basicSwitchExampleScenePart = {
  checked: {
    locator: byDataTestId('default-checked'),
    driver: SwitchDriver,
  },
  unchecked: {
    locator: byDataTestId('default-unchecked'),
    driver: SwitchDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: SwitchDriver,
  },
} satisfies ScenePart;

/**
 * Basic Switch example from MUI's website
 * @see https://mui.com/material-ui/react-switch
 */
export const basicSwitchExample: IExampleUnit<typeof basicSwitchExampleScenePart, JSX.Element> = {
  title: 'Basic Switch',
  scene: basicSwitchExampleScenePart,
  ui: <BasicSwitch />,
};
//#endregion

export const basicSwitchTestSuite: TestSuiteInfo<typeof basicSwitchExampleScenePart> = {
  title: 'Basic Switch',
  url: '/switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicSwitchExample.title}`, () => {
      let testEngine: TestEngine<typeof basicSwitchExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(basicSwitchExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Checked switch is selected initially`, async () => {
        const value = await testEngine.parts.checked.isSelected();
        assertEqual(value, true);
      });

      test(`Checked switch is not disabled`, async () => {
        const value = await testEngine.parts.unchecked.isDisabled();
        assertEqual(value, false);
      });

      test(`Unchecked switch is not selected initially`, async () => {
        const value = await testEngine.parts.unchecked.isSelected();
        assertEqual(value, false);
      });

      test(`Disabled switch is not selected`, async () => {
        const value = await testEngine.parts.disabled.isSelected();
        assertEqual(value, false);
      });

      test(`Disabled switch is disabled`, async () => {
        const value = await testEngine.parts.disabled.isDisabled();
        assertEqual(value, true);
      });

      test(`Set checked switch to not selected should work`, async () => {
        await testEngine.parts.checked.setSelected(false);
        const value = await testEngine.parts.checked.isSelected();
        assertEqual(value, false);
      });

      test(`Set unchecked switch to selected should work`, async () => {
        await testEngine.parts.unchecked.setSelected(true);
        const value = await testEngine.parts.unchecked.isSelected();
        assertEqual(value, true);
      });
    });
  },
};
