import { JSX } from 'react';

import { HTMLAnchorDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { hoverAnchorUIExample } from './HoverAnchor.examples';

export const hoverAnchorExampleScenePart = {
  link: {
    locator: byDataTestId('hover-target'),
    driver: HTMLAnchorDriver,
  },
  tip: {
    locator: byDataTestId('hover-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const hoverAnchorExample: IExampleUnit<typeof hoverAnchorExampleScenePart, JSX.Element> = {
  ...hoverAnchorUIExample,
  scene: hoverAnchorExampleScenePart,
};

export const hoverAnchorExampleTestSuite: TestSuiteInfo<typeof hoverAnchorExample.scene> = {
  title: 'Anchor hover',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${hoverAnchorExample.title}`, () => {
      let testEngine: TestEngine<typeof hoverAnchorExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(hoverAnchorExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Detail is not shown when not hover', async () => {
        assertEqual(await testEngine.parts.tip.isVisible(), false);
      });

      test('Detail is shown when hover', async () => {
        await testEngine.parts.link.hover();
        await testEngine.parts.tip.waitUntilComponentState({
          condition: 'visible',
          timeoutMs: 500,
        });
        assertEqual(await testEngine.parts.tip.isVisible(), true);
      });
    });
  },
};
