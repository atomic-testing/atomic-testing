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

      // Astryx 0.4.2 gave HoverCard's layer `lazyMount`: the content is absent
      // from the DOM until the card opens. getContent therefore hovers and probes
      // for the reveal — which the component's own open state drives, so it lands
      // in jsdom as well as in a real browser. What stays E2E-only is whether the
      // revealed layer is actually *visible*, which this does not assert.
      test(`getContent reads the layer content once the card is open`, async () => {
        assertEqual(await engine().parts.hc.getContent(), 'Hover card content');
      });
    });
  },
};
