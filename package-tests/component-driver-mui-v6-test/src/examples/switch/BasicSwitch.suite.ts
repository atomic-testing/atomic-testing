import { JSX } from 'react';

import { SwitchDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { basicSwitchUIExample } from './BasicSwitch.examples';

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
  ...basicSwitchUIExample,
  scene: basicSwitchExampleScenePart,
};

export const basicSwitchTestSuite: TestSuiteInfo<typeof basicSwitchExampleScenePart> = {
  title: 'Basic Switch',
  url: '/switch',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
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

    test('it should have checked switch by default', async () => {
      assertEqual(await testEngine.parts.checked.exists(), true);
      assertEqual(await testEngine.parts.checked.isSelected(), true);
    });

    test('it should have unchecked switch by default', async () => {
      assertEqual(await testEngine.parts.unchecked.exists(), true);
      assertEqual(await testEngine.parts.unchecked.isSelected(), false);
    });

    test('it should have disabled switch', async () => {
      assertEqual(await testEngine.parts.disabled.exists(), true);
      assertEqual(await testEngine.parts.disabled.isDisabled(), true);
    });

    test('it should be able to toggle unchecked switch', async () => {
      await testEngine.parts.unchecked.setSelected(true);
      assertEqual(await testEngine.parts.unchecked.isSelected(), true);
    });
  },
};
