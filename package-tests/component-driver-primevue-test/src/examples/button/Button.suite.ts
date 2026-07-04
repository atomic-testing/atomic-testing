import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const buttonScenePart = {
  counter: {
    locator: byDataTestId('counter-button'),
    driver: HTMLButtonDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-button'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const buttonTestSuite: TestSuiteInfo<typeof buttonScenePart> = {
  title: 'PrimeVue Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Button', () => {
      const engine = useTestEngine(buttonScenePart, getTestEngine, { beforeEach, afterEach });

      test('renders its label', async () => {
        assertEqual(await engine().parts.counter.getText(), 'Count: 0');
      });

      test('click drives the state round-trip through Vue reactivity', async () => {
        await engine().parts.counter.click();
        assertEqual(await engine().parts.counter.getText(), 'Count: 1');
        await engine().parts.counter.click();
        assertEqual(await engine().parts.counter.getText(), 'Count: 2');
      });

      test('reads the disabled state', async () => {
        assertFalse(await engine().parts.counter.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
