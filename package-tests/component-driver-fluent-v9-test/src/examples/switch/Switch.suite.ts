import { SwitchDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { switchUIExample } from './Switch.examples';

export const switchExampleScenePart = {
  labeled: { locator: byDataTestId('switch-labeled'), driver: SwitchDriver },
  unlabeled: { locator: byDataTestId('switch-unlabeled'), driver: SwitchDriver },
  disabled: { locator: byDataTestId('switch-disabled'), driver: SwitchDriver },
  required: { locator: byDataTestId('switch-required'), driver: SwitchDriver },
} satisfies ScenePart;

export const switchExample: IExampleUnit<typeof switchExampleScenePart, JSX.Element> = {
  ...switchUIExample,
  scene: switchExampleScenePart,
};

export const switchExampleTestSuite: TestSuiteInfo<typeof switchExample.scene> = {
  title: 'Fluent Switch',
  url: '/switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${switchExample.title}`, () => {
      const engine = useTestEngine(switchExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the linked label and toggles selection', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Enable notifications');
        assertFalse(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(true);
        assertTrue(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(false);
        assertFalse(await engine().parts.labeled.isSelected());
      });

      test('has no label when unlabeled', async () => {
        assertEqual(await engine().parts.unlabeled.getLabel(), undefined);
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.labeled.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('reads required state and strips the asterisk from the label', async () => {
        assertTrue(await engine().parts.required.isRequired());
        assertFalse(await engine().parts.labeled.isRequired());
        assertEqual(await engine().parts.required.getLabel(), 'Required');
      });
    });
  },
};
