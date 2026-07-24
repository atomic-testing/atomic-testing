import { TooltipDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const tooltipScenePart = {
  // TooltipDriver is anchored at the TRIGGER — the portalled content is
  // role-less, so open state reads from the trigger's data-state and the text
  // resolves through the trigger's aria-describedby (see the driver doc).
  info: {
    locator: byDataTestId('info-trigger'),
    driver: TooltipDriver,
  },
} satisfies ScenePart;

export const tooltipTestSuite: TestSuiteInfo<typeof tooltipScenePart> = {
  title: 'Reka UI Tooltip',
  url: '/tooltip',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertNotEqual, assertTrue, assertFalse }
  ) => {
    describe('Reka UI Tooltip', () => {
      const engine = useTestEngine(tooltipScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.info.isOpen());
        assertEqual(await engine().parts.info.getState(), 'closed');
      });

      test('getContent is undefined while closed', async () => {
        assertEqual(await engine().parts.info.getContent(), undefined);
      });

      // The scene sets delayDuration={0}; the default 700ms open-delay
      // transition is E2E-only territory (see the driver doc).
      test('open() reveals the tooltip', async () => {
        await engine().parts.info.open();
        await engine().parts.info.waitForOpen();
        assertTrue(await engine().parts.info.isOpen());
        assertNotEqual(await engine().parts.info.getState(), 'closed');
      });

      test('reads the tooltip text through the aria-describedby link', async () => {
        await engine().parts.info.open();
        await engine().parts.info.waitForOpen();
        assertEqual(await engine().parts.info.getContent(), 'Saved automatically every 30 seconds');
      });

      // Pointer-leave closing is E2E-only (jsdom fires no pointerleave, and
      // Reka only closes on it at all when disableHoverableContent is set);
      // Escape via DismissableLayer is the portable close path.
      test('dismiss() closes the tooltip', async () => {
        await engine().parts.info.open();
        await engine().parts.info.waitForOpen();
        const closed = await engine().parts.info.dismiss();
        assertTrue(closed);
        assertFalse(await engine().parts.info.isOpen());
        assertEqual(await engine().parts.info.getState(), 'closed');
      });
    });
  },
};
