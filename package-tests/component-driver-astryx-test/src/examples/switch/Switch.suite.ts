import { SwitchDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, byRole, locatorUtil, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { switchControlUIExample } from './Switch.examples';

export const switchControlExampleScenePart = {
  notifications: {
    locator: locatorUtil.append(byDataTestId('notif-wrap'), byRole('switch')),
    driver: SwitchDriver,
  },
  darkMode: {
    locator: locatorUtil.append(byDataTestId('dark-wrap'), byRole('switch')),
    driver: SwitchDriver,
  },
} satisfies ScenePart;

export const switchControlExample: IExampleUnit<typeof switchControlExampleScenePart, JSX.Element> = {
  ...switchControlUIExample,
  scene: switchControlExampleScenePart,
};

export const switchControlExampleTestSuite: TestSuiteInfo<typeof switchControlExample.scene> = {
  title: 'Astryx Switch',
  url: '/switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${switchControlExample.title}`, () => {
      const engine = useTestEngine(switchControlExample.scene, getTestEngine, { beforeEach, afterEach });

      // isOn reads the checked state of the role="switch" input.
      test(`isOn reflects the on/off state`, async () => {
        assertTrue(await engine().parts.notifications.isOn());
        assertFalse(await engine().parts.darkMode.isOn());
      });

      // turnOff/turnOn/toggle drive the state via clicks.
      test(`turnOn/turnOff/toggle change the state`, async () => {
        await engine().parts.notifications.turnOff();
        assertFalse(await engine().parts.notifications.isOn());
        await engine().parts.darkMode.turnOn();
        assertTrue(await engine().parts.darkMode.isOn());
        await engine().parts.darkMode.toggle();
        assertFalse(await engine().parts.darkMode.isOn());
      });

      // getLabel resolves the linked <label for>; neither switch is disabled.
      test(`getLabel and isDisabled read the switch state`, async () => {
        assertEqual(await engine().parts.notifications.getLabel(), 'Notifications');
        assertFalse(await engine().parts.notifications.isDisabled());
      });
    });
  },
};
