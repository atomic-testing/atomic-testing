import { TooltipDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tooltipUIExample } from './Tooltip.examples';

export const tooltipExampleScenePart = {
  // TooltipDriver is anchored at the TRIGGER — the portalled content is
  // role-less, so open state reads from the trigger's data-state and the text
  // resolves through the trigger's aria-describedby (see the driver doc).
  tooltip: {
    locator: byDataTestId('tooltip-trigger'),
    driver: TooltipDriver,
  },
} satisfies ScenePart;

export const tooltipExample: IExampleUnit<typeof tooltipExampleScenePart, JSX.Element> = {
  ...tooltipUIExample,
  scene: tooltipExampleScenePart,
};

export const tooltipExampleTestSuite: TestSuiteInfo<typeof tooltipExample.scene> = {
  title: 'Radix Tooltip',
  url: '/tooltip',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tooltipExample.title}`, () => {
      const engine = useTestEngine(tooltipExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.tooltip.isOpen());
        assertEqual(await engine().parts.tooltip.getState(), 'closed');
      });

      test('getContent is undefined while closed', async () => {
        assertEqual(await engine().parts.tooltip.getContent(), undefined);
      });

      // The scene sets delayDuration={0}; the default 700ms open-delay
      // transition is E2E-only territory (see the driver doc).
      test('open() reveals the tooltip', async () => {
        await engine().parts.tooltip.open();
        await engine().parts.tooltip.waitForOpen();
        assertTrue(await engine().parts.tooltip.isOpen());
      });

      test('reads the tooltip text through the aria-describedby link', async () => {
        await engine().parts.tooltip.open();
        await engine().parts.tooltip.waitForOpen();
        assertEqual(await engine().parts.tooltip.getContent(), 'Tooltip body');
      });

      // Pointer-leave closing is E2E-only (jsdom fires no pointerleave);
      // Escape via DismissableLayer is the portable close path.
      test('dismiss() closes the tooltip', async () => {
        await engine().parts.tooltip.open();
        await engine().parts.tooltip.waitForOpen();
        const closed = await engine().parts.tooltip.dismiss();
        assertTrue(closed);
        assertFalse(await engine().parts.tooltip.isOpen());
      });
    });
  },
};
