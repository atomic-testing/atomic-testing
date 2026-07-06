import { CheckboxDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { checkboxUIExample } from './Checkbox.examples';

export const checkboxExampleScenePart = {
  labeled: {
    locator: byDataTestId('checkbox-labeled'),
    driver: CheckboxDriver,
  },
  indeterminate: {
    locator: byDataTestId('checkbox-indeterminate'),
    driver: CheckboxDriver,
  },
  disabled: {
    locator: byDataTestId('checkbox-disabled'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const checkboxExample: IExampleUnit<typeof checkboxExampleScenePart, JSX.Element> = {
  ...checkboxUIExample,
  scene: checkboxExampleScenePart,
};

export const checkboxExampleTestSuite: TestSuiteInfo<typeof checkboxExample.scene> = {
  title: 'Radix Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${checkboxExample.title}`, () => {
      const engine = useTestEngine(checkboxExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the linked label and toggles selection', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Accept terms');
        assertFalse(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(true);
        assertTrue(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(false);
        assertFalse(await engine().parts.labeled.isSelected());
      });

      test('has no label when unlinked', async () => {
        assertEqual(await engine().parts.indeterminate.getLabel(), undefined);
      });

      test('reads and clears the indeterminate state (two clicks to reach unchecked)', async () => {
        assertTrue(await engine().parts.indeterminate.isIndeterminate());
        assertFalse(await engine().parts.indeterminate.isSelected());

        await engine().parts.indeterminate.setSelected(false);
        assertFalse(await engine().parts.indeterminate.isIndeterminate());
        assertFalse(await engine().parts.indeterminate.isSelected());
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
