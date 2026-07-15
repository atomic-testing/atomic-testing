import { TooltipDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tooltipUIExample } from './Tooltip.examples';

export const tooltipExampleScenePart = {
  labelTooltip: { locator: byDataTestId('tooltip-label-trigger'), driver: TooltipDriver },
  descriptionTooltip: { locator: byDataTestId('tooltip-description-trigger'), driver: TooltipDriver },
  noTooltip: { locator: byDataTestId('tooltip-none-trigger'), driver: TooltipDriver },
} satisfies ScenePart;

export const tooltipExample: IExampleUnit<typeof tooltipExampleScenePart, JSX.Element> = {
  ...tooltipUIExample,
  scene: tooltipExampleScenePart,
};

export const tooltipExampleTestSuite: TestSuiteInfo<typeof tooltipExample.scene> = {
  title: 'Fluent Tooltip',
  url: '/tooltip',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, hasLayout }
  ) => {
    describe('Fluent Tooltip', () => {
      const engine = useTestEngine(tooltipExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.labelTooltip.isOpen());
      });

      test('"label" relationship: content is readable via aria-label without opening', async () => {
        assertEqual(await engine().parts.labelTooltip.getContent(), 'Save the current document');
      });

      test('"description" relationship: is not visually open initially, despite content being mounted', async () => {
        assertFalse(await engine().parts.descriptionTooltip.isOpen());
      });

      test('"description" relationship: content is readable via the aria-describedby link regardless of open state', async () => {
        assertEqual(await engine().parts.descriptionTooltip.getContent(), 'Extra detail about this field');
      });

      test('a trigger with no tooltip has no content', async () => {
        assertEqual(await engine().parts.noTooltip.getContent(), undefined);
      });

      // E2E-only: Fluent's tooltip visibility is driven by Floating UI positioning,
      // which depends on real layout (getBoundingClientRect). jsdom has no layout
      // engine, so the tooltip's visual open/close transition never completes there
      // (content is always MOUNTED — see TooltipDriver's class doc — but never
      // reports visible). See docs/docs/guides/portal-and-overlays.md's gating rule.
      if (hasLayout) {
        // Open/close behavior is exercised through the "description" relationship
        // only: it has a per-instance `aria-describedby` link, so `isOpen()`
        // resolves the EXACT tooltip. The "label" relationship's `isOpen()` falls
        // back to matching ANY mounted `role="tooltip"` on the page (see
        // TooltipDriver's class doc) — with more than one Tooltip-wrapped trigger
        // present (as this example deliberately has, to prove `getContent()` stays
        // correctly scoped per trigger), that fallback cannot reliably tell which
        // one is actually shown, so open/close behavior is not asserted through it.
        test('"description" relationship: opens via focus and becomes visible', async () => {
          await engine().parts.descriptionTooltip.open();
          assertTrue(await engine().parts.descriptionTooltip.isOpen());
          assertEqual(await engine().parts.descriptionTooltip.getContent(), 'Extra detail about this field');
        });

        test('"description" relationship: closes via blur (dismiss)', async () => {
          await engine().parts.descriptionTooltip.open();
          assertTrue(await engine().parts.descriptionTooltip.isOpen());
          assertTrue(await engine().parts.descriptionTooltip.dismiss());
          assertFalse(await engine().parts.descriptionTooltip.isOpen());
        });
      }
    });
  },
};
