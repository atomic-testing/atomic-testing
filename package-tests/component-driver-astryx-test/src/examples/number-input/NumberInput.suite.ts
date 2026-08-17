import { NumberInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { numberInputUIExample } from './NumberInput.examples';

export const numberInputExampleScenePart = {
  qtyInput: {
    locator: byDataTestId('qty-input'),
    driver: NumberInputDriver,
  },
  priceInput: {
    locator: byDataTestId('price-input'),
    driver: NumberInputDriver,
  },
} satisfies ScenePart;

export const numberInputExample: IExampleUnit<typeof numberInputExampleScenePart, JSX.Element> = {
  ...numberInputUIExample,
  scene: numberInputExampleScenePart,
};

export const numberInputExampleTestSuite: TestSuiteInfo<typeof numberInputExample.scene> = {
  title: 'Astryx NumberInput',
  url: '/number-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${numberInputExample.title}`, () => {
      const engine = useTestEngine(numberInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel resolves the linked <label for>.
      test(`getLabel returns the field label`, async () => {
        assertEqual(await engine().parts.qtyInput.getLabel(), 'Quantity');
      });

      // getValue reads the input's string value.
      test(`getValue reads the current value`, async () => {
        assertEqual(await engine().parts.qtyInput.getValue(), '5');
      });

      // Astryx 0.4.0 made NumberInput a text-backed spinbutton, so the bounds are
      // aria-valuemin/aria-valuemax rather than the native min/max. `step` has no
      // DOM representation at all now — it is asserted behaviourally below.
      test(`getMin/getMax read the numeric constraints`, async () => {
        assertEqual(await engine().parts.qtyInput.getMin(), 0);
        assertEqual(await engine().parts.qtyInput.getMax(), 10);
      });

      // The step (2) is only observable through what a step actually moves.
      // Astryx steps onto the grid `min + n * step` rather than adding `step` to
      // wherever the value happens to sit, so the first press off an off-grid
      // start (5, on a step-2 grid based at min=0) snaps to 6 — after that each
      // press is a whole step.
      test(`stepUp and stepDown move the value along the step grid`, async () => {
        await engine().parts.qtyInput.stepUp();
        assertEqual(await engine().parts.qtyInput.getValue(), '6');
        await engine().parts.qtyInput.stepUp();
        assertEqual(await engine().parts.qtyInput.getValue(), '8');
        await engine().parts.qtyInput.stepDown();
        assertEqual(await engine().parts.qtyInput.getValue(), '6');
      });

      // getUnits resolves the trailing units span (sibling of the input).
      test(`getUnits returns the units label`, async () => {
        assertEqual(await engine().parts.qtyInput.getUnits(), 'kg');
      });

      // setValue round-trips through the controlled onChange.
      test(`setValue round-trips`, async () => {
        await engine().parts.qtyInput.setValue('8');
        assertEqual(await engine().parts.qtyInput.getValue(), '8');
      });

      // getDisabledMessage resolves the tooltip out of the composed aria-describedby.
      test(`getDisabledMessage returns the disabled-reason tooltip, undefined when none`, async () => {
        assertEqual(
          await engine().parts.priceInput.getDisabledMessage(),
          'Pricing is locked while the order is processing'
        );
        assertEqual(await engine().parts.qtyInput.getDisabledMessage(), undefined);
      });
    });
  },
};
