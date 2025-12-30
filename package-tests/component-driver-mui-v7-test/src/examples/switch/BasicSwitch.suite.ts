import { JSX } from 'react';

import { SwitchDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(basicSwitchExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have checked switch by default', async () => {
      assertTrue(await engine().parts.checked.exists());
      assertTrue(await engine().parts.checked.isSelected());
    });

    test('it should have unchecked switch by default', async () => {
      assertTrue(await engine().parts.unchecked.exists());
      assertFalse(await engine().parts.unchecked.isSelected());
    });

    test('it should have disabled switch', async () => {
      assertTrue(await engine().parts.disabled.exists());
      assertTrue(await engine().parts.disabled.isDisabled());
    });

    test('it should be able to toggle unchecked switch', async () => {
      await engine().parts.unchecked.setSelected(true);
      assertTrue(await engine().parts.unchecked.isSelected());
    });
  },
};
