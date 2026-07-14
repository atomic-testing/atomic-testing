import { CheckboxDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { checkboxUIExample } from './Checkbox.examples';

export const checkboxExampleScenePart = {
  labeled: { locator: byDataTestId('checkbox-labeled'), driver: CheckboxDriver },
  unlabeled: { locator: byDataTestId('checkbox-unlabeled'), driver: CheckboxDriver },
  disabled: { locator: byDataTestId('checkbox-disabled'), driver: CheckboxDriver },
  required: { locator: byDataTestId('checkbox-required'), driver: CheckboxDriver },
  mixed: { locator: byDataTestId('checkbox-mixed'), driver: CheckboxDriver },
} satisfies ScenePart;

export const checkboxExample: IExampleUnit<typeof checkboxExampleScenePart, JSX.Element> = {
  ...checkboxUIExample,
  scene: checkboxExampleScenePart,
};

export const checkboxExampleTestSuite: TestSuiteInfo<typeof checkboxExample.scene> = {
  title: 'Fluent Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${checkboxExample.title}`, () => {
      const engine = useTestEngine(checkboxExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the linked label and toggles selection', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Accept terms');
        assertFalse(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(true);
        assertTrue(await engine().parts.labeled.isSelected());

        await engine().parts.labeled.setSelected(false);
        assertFalse(await engine().parts.labeled.isSelected());
      });

      test('has no label when unlabeled', async () => {
        assertEqual(await engine().parts.unlabeled.getLabel(), undefined);
      });

      test('reads disabled/required state per instance', async () => {
        assertFalse(await engine().parts.labeled.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
        assertTrue(await engine().parts.required.isRequired());
      });

      test('strips the required-marker asterisk from the label', async () => {
        assertEqual(await engine().parts.required.getLabel(), 'Required');
      });

      test('reads the value attribute (null when unset)', async () => {
        assertEqual(await engine().parts.labeled.getValue(), null);
      });

      test('reads the tri-state indeterminate flag per instance', async () => {
        assertTrue(await engine().parts.mixed.isIndeterminate());
        assertFalse(await engine().parts.labeled.isIndeterminate());
      });
    });
  },
};
