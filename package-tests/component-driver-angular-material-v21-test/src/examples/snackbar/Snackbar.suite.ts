import { ButtonDriver, SnackbarDriver, snackbarLocator } from '@atomic-testing/component-driver-angular-material-v21';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const snackbarScenePart = {
  opener: {
    locator: byDataTestId('snackbar-open-trigger'),
    driver: ButtonDriver,
  },
  timedOpener: {
    locator: byDataTestId('timed-snackbar-open-trigger'),
    driver: ButtonDriver,
  },
  // MatSnackBar exposes no per-instance identity hook, so the canonical
  // exported locator (the container tag under the CDK overlay container) is
  // the scene anchor; only one snackbar shows at a time.
  snackbar: {
    locator: snackbarLocator,
    driver: SnackbarDriver,
  },
  actionResult: {
    locator: byDataTestId('snackbar-action-result'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const snackbarTestSuite: TestSuiteInfo<typeof snackbarScenePart> = {
  title: 'Angular Material v21 Snackbar',
  url: '/snackbar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatSnackBar', () => {
      const engine = useTestEngine(snackbarScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not showing initially', async () => {
        assertFalse(await engine().parts.snackbar.isOpen());
      });

      test('shows with its message, action and live region', async () => {
        await engine().parts.opener.click();
        assertTrue(await engine().parts.snackbar.waitForOpen());
        assertEqual(await engine().parts.snackbar.getLabel(), 'Note archived');
        assertEqual(await engine().parts.snackbar.getActionLabel(), 'Undo');
        assertEqual(await engine().parts.snackbar.getPoliteness(), 'polite');
      });

      test('clicking the action runs its handler and dismisses the snackbar', async () => {
        await engine().parts.opener.click();
        assertTrue(await engine().parts.snackbar.waitForOpen());
        await engine().parts.snackbar.clickAction();
        assertTrue(await engine().parts.snackbar.waitForClose());
        const result = await engine().parts.snackbar.waitUntil({
          probeFn: async () => (await engine().parts.actionResult.getText())?.trim(),
          terminateCondition: 'undone',
          timeoutMs: 5000,
        });
        assertEqual(result, 'undone');
      });

      test('reports no action for an action-less snackbar', async () => {
        await engine().parts.timedOpener.click();
        assertTrue(await engine().parts.snackbar.waitForOpen());
        assertEqual(await engine().parts.snackbar.getActionLabel(), null);
      });

      test('auto-dismisses after its configured duration', async () => {
        await engine().parts.timedOpener.click();
        assertTrue(await engine().parts.snackbar.waitForOpen());
        // duration is 500ms; the probing wait absorbs the timer plus the exit
        // animation without sleeping a fixed amount.
        assertTrue(await engine().parts.snackbar.waitForClose(5000));
      });
    });
  },
};
