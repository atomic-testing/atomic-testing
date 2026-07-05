import { ToggleSwitchDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const toggleSwitchScenePart = {
  airplaneMode: {
    locator: byDataTestId('airplane-mode'),
    driver: ToggleSwitchDriver,
  },
  locked: {
    locator: byDataTestId('locked-switch'),
    driver: ToggleSwitchDriver,
  },
} satisfies ScenePart;

export const toggleSwitchTestSuite: TestSuiteInfo<typeof toggleSwitchScenePart> = {
  title: 'PrimeVue ToggleSwitch',
  url: '/toggle-switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe('PrimeVue ToggleSwitch', () => {
      const engine = useTestEngine(toggleSwitchScenePart, getTestEngine, { beforeEach, afterEach });

      test('toggles through setSelected', async () => {
        assertFalse(await engine().parts.airplaneMode.isSelected());
        await engine().parts.airplaneMode.setSelected(true);
        assertTrue(await engine().parts.airplaneMode.isSelected());
        await engine().parts.airplaneMode.setSelected(false);
        assertFalse(await engine().parts.airplaneMode.isSelected());
      });

      test('setSelected is idempotent', async () => {
        await engine().parts.airplaneMode.setSelected(true);
        await engine().parts.airplaneMode.setSelected(true);
        assertTrue(await engine().parts.airplaneMode.isSelected());
      });

      test('reads the disabled state and its held value', async () => {
        assertFalse(await engine().parts.airplaneMode.isDisabled());
        assertTrue(await engine().parts.locked.isDisabled());
        assertTrue(await engine().parts.locked.isSelected());
      });
    });
  },
};
