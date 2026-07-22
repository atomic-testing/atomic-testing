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
  range: {
    locator: byDataTestId('range-slider'),
    driver: SliderDriver,
  },
  vertical: {
    locator: byDataTestId('vertical-slider'),
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

      test('reports horizontal orientation for the default slider', async () => {
        assertEqual(await engine().parts.volume.getOrientation(), 'horizontal');
      });

      test('range slider reads and drives both thumbs independently (#1035)', async () => {
        assertEqual(await engine().parts.range.getRangeValues(), [20, 60]);
        assertTrue(await engine().parts.range.setRangeValues([30, 80]));
        assertEqual(await engine().parts.range.getRangeValues(), [30, 80]);
        assertEqual(await engine().parts.range.getOrientation(), 'horizontal');
      });

      test('single-thumb reads/writes throw MissingPartError on a range slider', async () => {
        let errorName = '';
        try {
          await engine().parts.range.getValue();
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, 'MissingPartError');
      });

      test('dragBy also throws MissingPartError on a range slider', async () => {
        let errorName = '';
        try {
          await engine().parts.range.dragBy({ x: 5, y: 0 });
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, 'MissingPartError');
      });

      test('vertical slider drives identically to horizontal and reports its orientation (#1035)', async () => {
        assertEqual(await engine().parts.vertical.getValue(), 40);
        assertEqual(await engine().parts.vertical.getOrientation(), 'vertical');
        assertTrue(await engine().parts.vertical.setValue(70));
        assertEqual(await engine().parts.vertical.getValue(), 70);
      });
    });
  },
};
