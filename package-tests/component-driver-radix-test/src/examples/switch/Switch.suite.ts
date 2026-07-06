import { SwitchDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { switchUIExample } from './Switch.examples';

export const switchExampleScenePart = {
  labeled: {
    locator: byDataTestId('switch-labeled'),
    driver: SwitchDriver,
  },
  disabled: {
    locator: byDataTestId('switch-disabled'),
    driver: SwitchDriver,
  },
} satisfies ScenePart;

export const switchExample: IExampleUnit<typeof switchExampleScenePart, JSX.Element> = {
  ...switchUIExample,
  scene: switchExampleScenePart,
};

export const switchExampleTestSuite: TestSuiteInfo<typeof switchExample.scene> = {
  title: 'Radix Switch',
  url: '/switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${switchExample.title}`, () => {
      const engine = useTestEngine(switchExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the linked label and toggles selection independently per instance', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Notifications');
        assertFalse(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(true);
        assertTrue(await engine().parts.labeled.isSelected());
        assertTrue(await engine().parts.disabled.isSelected());

        await engine().parts.labeled.setSelected(false);
        assertFalse(await engine().parts.labeled.isSelected());
      });

      test('has no label when unlinked', async () => {
        assertEqual(await engine().parts.disabled.getLabel(), undefined);
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.labeled.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('reads the value attribute', async () => {
        assertEqual(await engine().parts.labeled.getValue(), 'on');
      });
    });
  },
};
