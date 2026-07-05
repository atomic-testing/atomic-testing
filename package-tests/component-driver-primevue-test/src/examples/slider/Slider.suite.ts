import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { SliderDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const sliderScenePart = {
  volume: {
    locator: byDataTestId('volume'),
    driver: SliderDriver,
  },
  readout: {
    locator: byDataTestId('volume-readout'),
    driver: HTMLElementDriver,
  },
  frozen: {
    locator: byDataTestId('frozen-slider'),
    driver: SliderDriver,
  },
} satisfies ScenePart;

export const sliderTestSuite: TestSuiteInfo<typeof sliderScenePart> = {
  title: 'PrimeVue Slider',
  url: '/slider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Slider', () => {
      const engine = useTestEngine(sliderScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads value and bounds from the aria contract', async () => {
        assertEqual(await engine().parts.volume.getValue(), 30);
        assertEqual(await engine().parts.volume.getMin(), 0);
        assertEqual(await engine().parts.volume.getMax(), 100);
      });

      test('setValue drives the keyboard path in both directions', async () => {
        assertTrue(await engine().parts.volume.setValue(50));
        assertEqual(await engine().parts.volume.getValue(), 50);
        assertEqual(await engine().parts.readout.getText(), '50');

        assertTrue(await engine().parts.volume.setValue(15));
        assertEqual(await engine().parts.volume.getValue(), 15);
        assertEqual(await engine().parts.readout.getText(), '15');
      });

      test('setValue reports an off-step target as unreached', async () => {
        assertFalse(await engine().parts.volume.setValue(52));
      });

      test('reads the disabled state', async () => {
        assertFalse(await engine().parts.volume.isDisabled());
        assertTrue(await engine().parts.frozen.isDisabled());
      });
    });
  },
};
