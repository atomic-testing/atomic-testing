import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { SwitchDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const switchScenePart = {
  notifications: {
    locator: byDataTestId('notifications-switch'),
    driver: SwitchDriver,
  },
  readout: {
    locator: byDataTestId('switch-readout'),
    driver: HTMLElementDriver,
  },
  locked: {
    locator: byDataTestId('locked-switch'),
    driver: SwitchDriver,
  },
  labelled: {
    locator: byDataTestId('labelled-switch'),
    driver: SwitchDriver,
  },
} satisfies ScenePart;

export const switchTestSuite: TestSuiteInfo<typeof switchScenePart> = {
  title: 'Reka UI Switch',
  url: '/switch',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI Switch', () => {
      const engine = useTestEngine(switchScenePart, getTestEngine, { beforeEach, afterEach });

      test('starts unchecked and reads its value attribute', async () => {
        assertFalse(await engine().parts.notifications.isSelected());
        assertEqual(await engine().parts.notifications.getValue(), 'on');
      });

      test('setSelected drives the model round-trip', async () => {
        await engine().parts.notifications.setSelected(true);
        assertTrue(await engine().parts.notifications.isSelected());
        assertEqual(await engine().parts.readout.getText(), 'true');

        await engine().parts.notifications.setSelected(false);
        assertFalse(await engine().parts.notifications.isSelected());
        assertEqual(await engine().parts.readout.getText(), 'false');
      });

      test('setSelected is idempotent', async () => {
        await engine().parts.notifications.setSelected(false);
        assertFalse(await engine().parts.notifications.isSelected());
      });

      test('reads the disabled state and no-ops setSelected on it', async () => {
        assertTrue(await engine().parts.locked.isDisabled());
        await engine().parts.locked.setSelected(true);
        assertFalse(await engine().parts.locked.isSelected());
      });

      test('reads the label text through the native for/id link', async () => {
        assertEqual(await engine().parts.labelled.getLabel(), 'Airplane mode');
        assertEqual(await engine().parts.notifications.getLabel(), undefined);
      });
    });
  },
};
