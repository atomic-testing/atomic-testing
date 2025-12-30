import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { hoverMouseEventUIExample } from './Hover.examples';

export const hoverMouseEventExampleScenePart = {
  button: {
    locator: byDataTestId('hover-target'),
    driver: HTMLButtonDriver,
  },
  tip: {
    locator: byDataTestId('hover-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const hoverMouseEventExample: IExampleUnit<typeof hoverMouseEventExampleScenePart, JSX.Element> = {
  ...hoverMouseEventUIExample,
  scene: hoverMouseEventExampleScenePart,
};

export const hoverMouseEventExampleTestSuite: TestSuiteInfo<typeof hoverMouseEventExample.scene> = {
  title: 'Mouse event: Hover',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertFalse, assertTrue }) => {
    describe(`${hoverMouseEventExample.title}`, () => {
      const engine = useTestEngine(hoverMouseEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Detail is not shown when not hover`, async () => {
        assertFalse(await engine().parts.tip.isVisible());
      });

      test(`Detail is shown when hover`, async () => {
        await engine().parts.button.hover();
        // Wait until the tip is visible, this is because tooltip shows in the next rendering cycle
        await engine().parts.tip.waitUntilComponentState({
          condition: 'visible',
          timeoutMs: 500,
        });
        assertTrue(await engine().parts.tip.isVisible());
      });
    });
  },
};
