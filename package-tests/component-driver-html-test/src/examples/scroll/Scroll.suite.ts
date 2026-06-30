import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { scrollUIExample } from './Scroll.examples';

export const scrollExampleScenePart = {
  scrollContainer: {
    locator: byDataTestId('scroll-container'),
    driver: HTMLElementDriver,
  },
  scrollTarget: {
    locator: byDataTestId('scroll-target'),
    driver: HTMLElementDriver,
  },
  targetVisibility: {
    locator: byDataTestId('target-visibility'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const scrollExample: IExampleUnit<typeof scrollExampleScenePart, JSX.Element> = {
  ...scrollUIExample,
  scene: scrollExampleScenePart,
};

export const scrollExampleTestSuite: TestSuiteInfo<typeof scrollExample.scene> = {
  title: 'Scroll: scrollIntoView / scrollBy',
  url: '/scroll',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, hasLayout }) => {
    describe(`${scrollExample.title}`, () => {
      const engine = useTestEngine(scrollExample.scene, getTestEngine, { beforeEach, afterEach });

      // Cross-engine: the call resolves without throwing and leaves the structure
      // intact. jsdom has no layout, so visibility is not asserted here.
      test(`scrollIntoView resolves and the target still exists`, async () => {
        await engine().parts.scrollTarget.scrollIntoView();
        assertEqual(await engine().parts.scrollTarget.exists(), true);
      });

      test(`scrollBy resolves and the container still exists`, async () => {
        await engine().parts.scrollContainer.scrollBy({ x: 0, y: 300 });
        assertEqual(await engine().parts.scrollContainer.exists(), true);
      });

      // E2E-only: jsdom has no layout/IntersectionObserver, so visibility never
      // changes there. These assertions run only where a real layout engine exists.
      if (hasLayout) {
        test(`scrollIntoView brings the target into view`, async () => {
          assertEqual(await engine().parts.targetVisibility.getText(), 'false');
          await engine().parts.scrollTarget.scrollIntoView();
          const v = await engine().parts.targetVisibility.waitUntil({
            probeFn: () => engine().parts.targetVisibility.getText(),
            terminateCondition: 'true',
            timeoutMs: 2000,
          });
          assertEqual(v, 'true');
        });

        test(`scrollBy reveals the target`, async () => {
          await engine().parts.scrollContainer.scrollBy({ x: 0, y: 1000 });
          const v = await engine().parts.targetVisibility.waitUntil({
            probeFn: () => engine().parts.targetVisibility.getText(),
            terminateCondition: 'true',
            timeoutMs: 2000,
          });
          assertEqual(v, 'true');
        });
      }
    });
  },
};
