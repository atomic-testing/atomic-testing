import { HTMLAnchorDriver } from '@atomic-testing/component-driver-html';
import { HoverCardDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { hoverCardUIExample } from './HoverCard.examples';

// HoverCard has NO aria link from trigger to content (by design — sighted
// users only), so the scene uses the trigger/overlay split: hover the trigger
// part, read the card via HoverCardDriver's popper-wrapper re-root.
export const hoverCardExampleScenePart = {
  trigger: {
    locator: byDataTestId('hover-card-trigger'),
    driver: HTMLAnchorDriver,
  },
  card: {
    locator: byDataTestId('hover-card-content'),
    driver: HoverCardDriver,
  },
} satisfies ScenePart;

export const hoverCardExample: IExampleUnit<typeof hoverCardExampleScenePart, JSX.Element> = {
  ...hoverCardUIExample,
  scene: hoverCardExampleScenePart,
};

export const hoverCardExampleTestSuite: TestSuiteInfo<typeof hoverCardExample.scene> = {
  title: 'Radix HoverCard',
  url: '/hover-card',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${hoverCardExample.title}`, () => {
      const engine = useTestEngine(hoverCardExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.card.isOpen());
      });

      // The scene sets openDelay={0}; the default 700ms delay behaviour is a
      // consumer timing choice and is E2E-only territory (see the driver doc).
      test('hovering the trigger opens the card', async () => {
        await engine().parts.trigger.hover();
        await engine().parts.card.waitForOpen();
        assertTrue(await engine().parts.card.isOpen());
      });

      test('reads the card content once open', async () => {
        await engine().parts.trigger.hover();
        await engine().parts.card.waitForOpen();
        assertEqual(await engine().parts.card.getText(), 'Radix Primitives — unstyled, accessible components.');
      });

      // Pointer-leave closing is E2E-only (jsdom fires no pointerleave);
      // Escape via DismissableLayer is the portable close path.
      test('pressing Escape closes the card', async () => {
        await engine().parts.trigger.hover();
        await engine().parts.card.waitForOpen();
        const closed = await engine().parts.card.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.card.isOpen());
      });
    });
  },
};
