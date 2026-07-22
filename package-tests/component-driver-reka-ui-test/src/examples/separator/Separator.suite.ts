import { SeparatorDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const separatorScenePart = {
  horizontal: {
    locator: byDataTestId('horizontal-separator'),
    driver: SeparatorDriver,
  },
  vertical: {
    locator: byDataTestId('vertical-separator'),
    driver: SeparatorDriver,
  },
  decorative: {
    locator: byDataTestId('decorative-separator'),
    driver: SeparatorDriver,
  },
} satisfies ScenePart;

export const separatorTestSuite: TestSuiteInfo<typeof separatorScenePart> = {
  title: 'Reka UI Separator',
  url: '/separator',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI Separator', () => {
      const engine = useTestEngine(separatorScenePart, getTestEngine, { beforeEach, afterEach });

      test('defaults to horizontal orientation, not decorative', async () => {
        assertEqual(await engine().parts.horizontal.getOrientation(), 'horizontal');
        assertFalse(await engine().parts.horizontal.isDecorative());
      });

      test('reads a vertical orientation', async () => {
        assertEqual(await engine().parts.vertical.getOrientation(), 'vertical');
      });

      test('reads decorative separators (role="none")', async () => {
        assertTrue(await engine().parts.decorative.isDecorative());
      });
    });
  },
};
