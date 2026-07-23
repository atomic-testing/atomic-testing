import { SliderDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const sliderScenePart = {
  volume: {
    locator: byDataTestId('volume-slider'),
    driver: SliderDriver,
  },
  frozen: {
    locator: byDataTestId('frozen-slider'),
    driver: SliderDriver,
  },
} satisfies ScenePart;

export const sliderTestSuite: TestSuiteInfo<typeof sliderScenePart> = {
  title: 'Reka UI Slider',
  url: '/slider',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, hasLayout }
  ) => {
    describe('Reka UI Slider', () => {
      const engine = useTestEngine(sliderScenePart, getTestEngine, { beforeEach, afterEach });

      // aria-valuenow/min/max are plain DOM state driven by Vue, not geometry,
      // so these reads are cross-engine (jsdom + E2E alike).
      test('reads the initial value and bounds', async () => {
        assertEqual(await engine().parts.volume.getValue(), 30);
        assertEqual(await engine().parts.volume.getMin(), 0);
        assertEqual(await engine().parts.volume.getMax(), 100);
      });

      test('reads the accessible label', async () => {
        assertEqual(await engine().parts.volume.getLabel(), 'Volume');
      });

      // Keyboard is the cross-engine write path (no native <input type="range">
      // exists to drive with setRangeValue).
      test('setValue steps the thumb up and down via the keyboard', async () => {
        assertTrue(await engine().parts.volume.setValue(45));
        assertEqual(await engine().parts.volume.getValue(), 45);

        assertTrue(await engine().parts.volume.setValue(20));
        assertEqual(await engine().parts.volume.getValue(), 20);
      });

      test('setValue clamps at the bounds', async () => {
        assertTrue(await engine().parts.volume.setValue(100));
        assertEqual(await engine().parts.volume.getValue(), 100);

        assertTrue(await engine().parts.volume.setValue(0));
        assertEqual(await engine().parts.volume.getValue(), 0);
      });

      test('isDisabled distinguishes the two scene instances', async () => {
        assertFalse(await engine().parts.volume.isDisabled());
        assertTrue(await engine().parts.frozen.isDisabled());
      });

      // Reka's own SliderRoot keydown handler gates every step on its
      // `disabled` ref regardless of thumb focus (DOM audit confirmed the
      // disabled thumb also carries no `tabindex`, so `.focus()` cannot even
      // move focus onto it) — so setValue naturally no-ops here, with no
      // explicit disabled guard needed in the driver.
      test('setValue no-ops on a disabled slider', async () => {
        assertFalse(await engine().parts.frozen.setValue(80));
        assertEqual(await engine().parts.frozen.getValue(), 40);
      });

      // Cross-engine: drag fires the pointer sequence without throwing even
      // though jsdom has no layout engine to move the thumb.
      test('dragBy resolves without throwing', async () => {
        await engine().parts.volume.dragBy({ x: 20, y: 0 });
        assertEqual(await engine().parts.volume.exists(), true);
      });

      // E2E-only: jsdom has no layout, so a drag never produces a positional
      // outcome there (see Interactor.drag). A directional check (rather than
      // a precise target value) keeps this independent of the scene's exact
      // pixel-to-value geometry.
      if (hasLayout) {
        test('dragBy moves the thumb toward the drag direction', async () => {
          const before = await engine().parts.volume.getValue();
          await engine().parts.volume.dragBy({ x: 60, y: 0 });
          const after = await engine().parts.volume.getValue();
          assertTrue(after > before);
        });
      }
    });
  },
};
