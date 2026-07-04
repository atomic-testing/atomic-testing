import { ButtonDriver } from '@atomic-testing/component-driver-angular-material-v20';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const buttonScenePart = {
  saveButton: {
    locator: byDataTestId('save-button'),
    driver: ButtonDriver,
  },
  clickCount: {
    locator: byDataTestId('click-count'),
    driver: HTMLElementDriver,
  },
  disabledButton: {
    locator: byDataTestId('disabled-button'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const buttonTestSuite: TestSuiteInfo<typeof buttonScenePart> = {
  title: 'Angular Material v20 Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatButton smoke', () => {
      const engine = useTestEngine(buttonScenePart, getTestEngine, { beforeEach, afterEach });

      // The `matButton` directive keeps the native <button> as the host
      // element, so the data-testid locator resolves directly to it.
      test('button exists and renders its label', async () => {
        assertTrue(await engine().parts.saveButton.exists());
        assertEqual(await engine().parts.saveButton.getText(), 'Save');
      });

      // click reaches the wired (click) handler — the recorded counter advances.
      test('click reaches the wired handler', async () => {
        assertEqual(await engine().parts.clickCount.getText(), '0');
        await engine().parts.saveButton.click();
        const count = await engine().parts.clickCount.waitUntil({
          probeFn: () => engine().parts.clickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // isDisabled reflects the native `disabled` attribute on a disabled
      // instance and stays false for an enabled one.
      test('isDisabled reflects the disabled state', async () => {
        assertTrue(await engine().parts.disabledButton.isDisabled());
        assertFalse(await engine().parts.saveButton.isDisabled());
      });
    });
  },
};
