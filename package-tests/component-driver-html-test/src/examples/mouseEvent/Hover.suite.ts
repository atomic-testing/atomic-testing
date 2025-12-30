import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof hoverMouseEventExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(hoverMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Detail is not shown when not hover`, async () => {
        assertFalse(await testEngine.parts.tip.isVisible());
      });

      test(`Detail is shown when hover`, async () => {
        await testEngine.parts.button.hover();
        // Wait until the tip is visible, this is because tooltip shows in the next rendering cycle
        await testEngine.parts.tip.waitUntilComponentState({
          condition: 'visible',
          timeoutMs: 500,
        });
        assertTrue(await testEngine.parts.tip.isVisible());
      });
    });
  },
};
