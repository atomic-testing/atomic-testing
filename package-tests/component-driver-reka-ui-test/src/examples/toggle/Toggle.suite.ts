import { ToggleDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const toggleScenePart = {
  bold: {
    locator: byDataTestId('bold-toggle'),
    driver: ToggleDriver,
  },
  locked: {
    locator: byDataTestId('locked-toggle'),
    driver: ToggleDriver,
  },
} satisfies ScenePart;

export const toggleTestSuite: TestSuiteInfo<typeof toggleScenePart> = {
  title: 'Reka UI Toggle',
  url: '/toggle',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe('Reka UI Toggle', () => {
      const engine = useTestEngine(toggleScenePart, getTestEngine, { beforeEach, afterEach });

      test('starts unpressed', async () => {
        assertFalse(await engine().parts.bold.isSelected());
      });

      test('setSelected drives the pressed state round-trip', async () => {
        await engine().parts.bold.setSelected(true);
        assertTrue(await engine().parts.bold.isSelected());

        await engine().parts.bold.setSelected(false);
        assertFalse(await engine().parts.bold.isSelected());
      });

      test('reads the disabled state and no-ops setSelected on it', async () => {
        assertTrue(await engine().parts.locked.isDisabled());
        await engine().parts.locked.setSelected(true);
        assertFalse(await engine().parts.locked.isSelected());
      });
    });
  },
};
