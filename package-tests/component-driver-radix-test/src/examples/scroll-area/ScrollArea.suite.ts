import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ScrollAreaDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { scrollAreaUIExample } from './ScrollArea.examples';

export const scrollAreaExampleScenePart = {
  scrollArea: {
    locator: byDataTestId('scroll-area'),
    driver: ScrollAreaDriver,
  },
  // A row far enough down to be off-screen in the 100px-tall viewport until the
  // viewport is scrolled — used to observe scrollBy's effect on real geometry.
  row: {
    locator: byDataTestId('scroll-area-row-20'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const scrollAreaExample: IExampleUnit<typeof scrollAreaExampleScenePart, JSX.Element> = {
  ...scrollAreaUIExample,
  scene: scrollAreaExampleScenePart,
};

export const scrollAreaExampleTestSuite: TestSuiteInfo<typeof scrollAreaExample.scene> = {
  title: 'Radix ScrollArea',
  url: '/scroll-area',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, hasLayout }) => {
    describe(`${scrollAreaExample.title}`, () => {
      const engine = useTestEngine(scrollAreaExample.scene, getTestEngine, { beforeEach, afterEach });

      // data-state is a structural attribute (Radix's `type="always"` renders it
      // hardcoded), so it renders faithfully under jsdom too.
      test(`reads the vertical scrollbar's state`, async () => {
        assertEqual(await engine().parts.scrollArea.getScrollbarState('vertical'), 'visible');
      });

      test(`reads undefined for an axis with no rendered scrollbar`, async () => {
        assertEqual(await engine().parts.scrollArea.getScrollbarState('horizontal'), undefined);
      });

      // Cross-engine: the call resolves without throwing and the viewport part
      // still exists, exercising the event wiring; jsdom has no layout engine so
      // the resulting scroll offset is not asserted here.
      test(`scrollBy on the viewport resolves without throwing`, async () => {
        await engine().parts.scrollArea.parts.viewport.scrollBy({ x: 0, y: 200 });
        assertEqual(await engine().parts.scrollArea.parts.viewport.exists(), true);
      });

      // E2E-only: jsdom has no layout, so getBoundingRect is a zero-rect there
      // (Wave 0 audit verified scrollTop moving 0 -> 200 against this same
      // viewport). A row's page-relative y position moves up by ~the scroll delta.
      if (hasLayout) {
        test(`scrollBy moves row geometry by roughly the delta`, async () => {
          const before = await engine().parts.row.getBoundingRect();
          await engine().parts.scrollArea.parts.viewport.scrollBy({ x: 0, y: 200 });
          const after = await engine().parts.row.getBoundingRect();
          assertTrue(Math.abs(before.y - after.y - 200) < 5);
        });
      }
    });
  },
};
