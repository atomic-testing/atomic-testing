import { SlideToggleDriver } from '@atomic-testing/component-driver-angular-material-v21';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const slideToggleScenePart = {
  wifi: {
    locator: byDataTestId('wifi'),
    driver: SlideToggleDriver,
  },
  wifiState: {
    locator: byDataTestId('wifi-state'),
    driver: HTMLElementDriver,
  },
  bluetooth: {
    locator: byDataTestId('bluetooth'),
    driver: SlideToggleDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-toggle'),
    driver: SlideToggleDriver,
  },
  required: {
    locator: byDataTestId('required-toggle'),
    driver: SlideToggleDriver,
  },
} satisfies ScenePart;

export const slideToggleTestSuite: TestSuiteInfo<typeof slideToggleScenePart> = {
  title: 'Angular Material v21 SlideToggle',
  url: '/slide-toggle',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatSlideToggle', () => {
      const engine = useTestEngine(slideToggleScenePart, getTestEngine, { beforeEach, afterEach });

      // The widget is a button with role="switch"; aria-checked carries the
      // on/off state.
      test('reports the initial state per instance', async () => {
        assertFalse(await engine().parts.wifi.isSelected());
        assertTrue(await engine().parts.bluetooth.isSelected());
      });

      // setSelected clicks the switch, so Material's (change) output fires —
      // the recorded state advances alongside aria-checked.
      test('setSelected toggles the switch and reaches the change handler', async () => {
        await engine().parts.wifi.setSelected(true);
        assertTrue(await engine().parts.wifi.isSelected());
        assertEqual(await engine().parts.wifiState.getText(), 'true');

        await engine().parts.wifi.setSelected(false);
        assertFalse(await engine().parts.wifi.isSelected());
        assertEqual(await engine().parts.wifiState.getText(), 'false');
      });

      test('setSelected is a no-op when already in the desired state', async () => {
        await engine().parts.bluetooth.setSelected(true);
        assertTrue(await engine().parts.bluetooth.isSelected());
      });

      // Each toggle resolves its own <label for>↔id association — two
      // instances never leak each other's label.
      test('reads each instance its own label', async () => {
        assertEqual(await engine().parts.wifi.getLabel(), 'Wi-Fi');
        assertEqual(await engine().parts.bluetooth.getLabel(), 'Bluetooth');
      });

      test('reports the disabled state', async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
        assertFalse(await engine().parts.wifi.isDisabled());
      });

      // The switch is a button, so requiredness is signalled via
      // aria-required rather than a native required attribute.
      test('reports the required state', async () => {
        assertTrue(await engine().parts.required.isRequired());
        assertFalse(await engine().parts.wifi.isRequired());
      });
    });
  },
};
