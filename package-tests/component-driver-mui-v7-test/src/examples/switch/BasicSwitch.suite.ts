import { JSX } from 'react';

import { SwitchDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    let testEngine: TestEngine<typeof basicSwitchExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicSwitchExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have checked switch by default', async () => {
      assertTrue(await testEngine.parts.checked.exists());
      assertTrue(await testEngine.parts.checked.isSelected());
    });

    test('it should have unchecked switch by default', async () => {
      assertTrue(await testEngine.parts.unchecked.exists());
      assertFalse(await testEngine.parts.unchecked.isSelected());
    });

    test('it should have disabled switch', async () => {
      assertTrue(await testEngine.parts.disabled.exists());
      assertTrue(await testEngine.parts.disabled.isDisabled());
    });

    test('it should be able to toggle unchecked switch', async () => {
      await testEngine.parts.unchecked.setSelected(true);
      assertTrue(await testEngine.parts.unchecked.isSelected());
    });
  },
};
