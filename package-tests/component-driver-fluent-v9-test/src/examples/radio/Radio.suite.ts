import { RadioDriver, RadioGroupDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byCssSelector, byDataTestId, IExampleUnit, locatorUtil, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { radioUIExample } from './Radio.examples';

export const radioExampleScenePart = {
  // RadioGroupDriver (= HTMLRadioButtonGroupDriver) resolves its own locator
  // directly to the SET of native radio inputs (its `:checked`/`[value=]`
  // reads are compound selectors on that same set) — not to the
  // `[role="radiogroup"]` wrapper, which carries neither `checked` nor `value`.
  group: {
    locator: locatorUtil.append(byDataTestId('radio-group'), byCssSelector('input[type="radio"]')),
    driver: RadioGroupDriver,
  },
  one: { locator: byDataTestId('radio-one'), driver: RadioDriver },
  two: { locator: byDataTestId('radio-two'), driver: RadioDriver },
  unlabeled: { locator: byDataTestId('radio-unlabeled'), driver: RadioDriver },
  disabled: { locator: byDataTestId('radio-disabled'), driver: RadioDriver },
} satisfies ScenePart;

export const radioExample: IExampleUnit<typeof radioExampleScenePart, JSX.Element> = {
  ...radioUIExample,
  scene: radioExampleScenePart,
};

export const radioExampleTestSuite: TestSuiteInfo<typeof radioExample.scene> = {
  title: 'Fluent RadioGroup',
  url: '/radio',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${radioExample.title}`, () => {
      const engine = useTestEngine(radioExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('group reads the selected value and re-selects by value', async () => {
        assertEqual(await engine().parts.group.getValue(), '1');
        assertTrue(await engine().parts.one.isSelected());
        assertFalse(await engine().parts.two.isSelected());

        await engine().parts.group.setValue('2');
        assertEqual(await engine().parts.group.getValue(), '2');
        assertFalse(await engine().parts.one.isSelected());
        assertTrue(await engine().parts.two.isSelected());
      });

      test('reads each item label and value', async () => {
        assertEqual(await engine().parts.one.getLabel(), 'One');
        assertEqual(await engine().parts.one.getValue(), '1');
        assertEqual(await engine().parts.two.getLabel(), 'Two');
      });

      test('has no label when unlabeled', async () => {
        assertEqual(await engine().parts.unlabeled.getLabel(), undefined);
      });

      test('a radio cannot be deselected directly', async () => {
        let threw = false;
        try {
          await engine().parts.one.setSelected(false);
        } catch {
          threw = true;
        }
        assertTrue(threw);
      });

      test('disabled cascades from a disabled group to its items', async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
