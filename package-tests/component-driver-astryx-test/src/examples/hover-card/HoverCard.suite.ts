import { HoverCardDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { hoverCardUIExample } from './HoverCard.examples';

export const hoverCardExampleScenePart = {
  hc: {
    locator: byDataTestId('hc-trigger'),
    driver: HoverCardDriver,
  },
} satisfies ScenePart;

export const hoverCardExample: IExampleUnit<typeof hoverCardExampleScenePart, JSX.Element> = {
  ...hoverCardUIExample,
  scene: hoverCardExampleScenePart,
};

export const hoverCardExampleTestSuite: TestSuiteInfo<typeof hoverCardExample.scene> = {
  title: 'Astryx HoverCard',
  url: '/hover-card',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${hoverCardExample.title}`, () => {
      const engine = useTestEngine(hoverCardExample.scene, getTestEngine, { beforeEach, afterEach });

      // The trigger's own text reads directly.
      test(`getTriggerText reads the trigger label`, async () => {
        assertEqual(await engine().parts.hc.getTriggerText(), 'Hover me');
      });

      // The layer stays mounted in jsdom, so getContent reads through aria-describedby.
      // Open/visibility is E2E-only and NOT asserted here.
      test(`getContent reads the layer content via aria-describedby`, async () => {
        assertEqual(await engine().parts.hc.getContent(), 'Hover card content');
      });
    });
  },
};
