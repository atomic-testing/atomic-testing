import { SpinButtonDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { spinButtonUIExample } from './SpinButton.examples';

export const spinButtonExampleScenePart = {
  a: { locator: byDataTestId('spinbutton-a'), driver: SpinButtonDriver },
  b: { locator: byDataTestId('spinbutton-b'), driver: SpinButtonDriver },
  disabled: { locator: byDataTestId('spinbutton-disabled'), driver: SpinButtonDriver },
  required: { locator: byDataTestId('spinbutton-required'), driver: SpinButtonDriver },
  readonly: { locator: byDataTestId('spinbutton-readonly'), driver: SpinButtonDriver },
  invalid: { locator: byDataTestId('spinbutton-invalid'), driver: SpinButtonDriver },
} satisfies ScenePart;

export const spinButtonExample: IExampleUnit<typeof spinButtonExampleScenePart, JSX.Element> = {
  ...spinButtonUIExample,
  scene: spinButtonExampleScenePart,
};

export const spinButtonExampleTestSuite: TestSuiteInfo<typeof spinButtonExample.scene> = {
  title: 'Fluent SpinButton',
  url: '/spinbutton',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${spinButtonExample.title}`, () => {
      const engine = useTestEngine(spinButtonExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the initial value and commits a typed value', async () => {
        assertEqual(await engine().parts.a.getValue(), 5);

        const committed = await engine().parts.a.setValue(8);
        assertTrue(committed);
        assertEqual(await engine().parts.a.getValue(), 8);
      });

      test('commits a typed value verbatim without clamping to bounds', async () => {
        const committed = await engine().parts.a.setValue(999);
        assertTrue(committed);
        assertEqual(await engine().parts.a.getValue(), 999);
      });

      test('reads distinct bounds per instance', async () => {
        assertEqual(await engine().parts.a.getMin(), 0);
        assertEqual(await engine().parts.a.getMax(), 10);
        assertEqual(await engine().parts.b.getMin(), 20);
        assertEqual(await engine().parts.b.getMax(), 100);
      });

      test('increments and decrements each instance independently', async () => {
        assertEqual(await engine().parts.a.getValue(), 5);
        assertEqual(await engine().parts.b.getValue(), 50);

        await engine().parts.a.increment();
        assertEqual(await engine().parts.a.getValue(), 6);
        assertEqual(await engine().parts.b.getValue(), 50);

        await engine().parts.b.increment();
        assertEqual(await engine().parts.b.getValue(), 55);
        assertEqual(await engine().parts.a.getValue(), 6);

        await engine().parts.a.decrement();
        assertEqual(await engine().parts.a.getValue(), 5);
        assertEqual(await engine().parts.b.getValue(), 55);
      });

      test('jumps to the bounds via Home/End', async () => {
        await engine().parts.a.moveToMax();
        assertEqual(await engine().parts.a.getValue(), 10);

        await engine().parts.a.moveToMin();
        assertEqual(await engine().parts.a.getValue(), 0);
      });

      test('steps by the larger stepPage increment via PageUp/PageDown', async () => {
        assertEqual(await engine().parts.b.getValue(), 50);

        await engine().parts.b.incrementByPage();
        assertEqual(await engine().parts.b.getValue(), 70);

        await engine().parts.b.decrementByPage();
        assertEqual(await engine().parts.b.getValue(), 50);
      });

      test('reads disabled/required/readonly/error state per instance', async () => {
        assertFalse(await engine().parts.a.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());

        assertFalse(await engine().parts.a.isRequired());
        assertTrue(await engine().parts.required.isRequired());

        assertFalse(await engine().parts.a.isReadonly());
        assertTrue(await engine().parts.readonly.isReadonly());

        assertFalse(await engine().parts.a.isError());
        assertTrue(await engine().parts.invalid.isError());
      });
    });
  },
};
