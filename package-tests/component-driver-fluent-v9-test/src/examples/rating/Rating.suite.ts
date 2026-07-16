import { RatingDisplayDriver, RatingDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { ratingUIExample } from './Rating.examples';

export const ratingExampleScenePart = {
  a: { locator: byDataTestId('rating-a'), driver: RatingDriver },
  b: { locator: byDataTestId('rating-b'), driver: RatingDriver },
  unset: { locator: byDataTestId('rating-unset'), driver: RatingDriver },
  half: { locator: byDataTestId('rating-half'), driver: RatingDriver },
  disabled: { locator: byDataTestId('rating-disabled'), driver: RatingDriver },
  display: { locator: byDataTestId('rating-display'), driver: RatingDisplayDriver },
  displayEmpty: { locator: byDataTestId('rating-display-empty'), driver: RatingDisplayDriver },
} satisfies ScenePart;

export const ratingExample: IExampleUnit<typeof ratingExampleScenePart, JSX.Element> = {
  ...ratingUIExample,
  scene: ratingExampleScenePart,
};

export const ratingExampleTestSuite: TestSuiteInfo<typeof ratingExample.scene> = {
  title: 'Fluent Rating',
  url: '/rating',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${ratingExample.title}`, () => {
      const engine = useTestEngine(ratingExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the selected value and disambiguates two instances independently', async () => {
        assertEqual(await engine().parts.a.getValue(), 3);
        assertEqual(await engine().parts.b.getValue(), 1);

        await engine().parts.a.setValue(5);
        assertEqual(await engine().parts.a.getValue(), 5);
        // Mutating one instance must not affect the sibling instance's own state.
        assertEqual(await engine().parts.b.getValue(), 1);
      });

      test('reads null for a Rating with no value selected', async () => {
        assertEqual(await engine().parts.unset.getValue(), null);
      });

      test('drives a half-step Rating to a fractional value', async () => {
        assertEqual(await engine().parts.half.getValue(), 2.5);

        await engine().parts.half.setValue(4.5);
        assertEqual(await engine().parts.half.getValue(), 4.5);
      });

      test('setValue returns false and does not mutate for an out-of-range/off-grid target', async () => {
        assertFalse(await engine().parts.a.setValue(4.5));
        assertEqual(await engine().parts.a.getValue(), 3);
      });

      test('setValue returns false for null (clearing an already-set Rating is unsupported)', async () => {
        assertFalse(await engine().parts.b.setValue(null));
        assertEqual(await engine().parts.b.getValue(), 1);
      });

      test('reads disabled state per instance (via ancestor fieldset)', async () => {
        assertFalse(await engine().parts.a.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('reads the RatingDisplay value/count/max at a value distinct from the interactive instances', async () => {
        assertEqual(await engine().parts.display.getValue(), 4.5);
        assertEqual(await engine().parts.display.getCount(), 1234);
        assertEqual(await engine().parts.display.getMax(), 5);
      });

      test('reads undefined value/count for a RatingDisplay with neither prop set', async () => {
        assertEqual(await engine().parts.displayEmpty.getValue(), undefined);
        assertEqual(await engine().parts.displayEmpty.getCount(), undefined);
      });
    });
  },
};
