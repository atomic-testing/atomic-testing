import { JSX } from 'react';

import { HTMLAnchorDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertFalse, assertTrue }) => {
    describe(`${hoverAnchorExample.title}`, () => {
      const engine = useTestEngine(hoverAnchorExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Detail is not shown when not hover', async () => {
        assertFalse(await engine().parts.tip.isVisible());
      });

      test('Detail is shown when hover', async () => {
        await engine().parts.link.hover();
        await engine().parts.tip.waitUntilComponentState({
          condition: 'visible',
          timeoutMs: 500,
        });
        assertTrue(await engine().parts.tip.isVisible());
      });
    });
  },
};
