import { TooltipDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tooltipUIExample } from './Tooltip.examples';

export const tooltipExampleScenePart = {
  tt: {
    locator: byDataTestId('tt-trigger'),
    driver: TooltipDriver,
  },
} satisfies ScenePart;

export const tooltipExample: IExampleUnit<typeof tooltipExampleScenePart, JSX.Element> = {
  ...tooltipUIExample,
  scene: tooltipExampleScenePart,
};

export const tooltipExampleTestSuite: TestSuiteInfo<typeof tooltipExample.scene> = {
  title: 'Astryx Tooltip',
  url: '/tooltip',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${tooltipExample.title}`, () => {
      const engine = useTestEngine(tooltipExample.scene, getTestEngine, { beforeEach, afterEach });

      // The trigger's own text reads directly.
      test(`getTriggerText reads the trigger label`, async () => {
        assertEqual(await engine().parts.tt.getTriggerText(), 'Hover me');
      });

      // The layer stays mounted in jsdom, so getContent reads through aria-describedby.
      // Open/visibility is E2E-only and NOT asserted here.
      test(`getContent reads the tooltip text via aria-describedby`, async () => {
        assertEqual(await engine().parts.tt.getContent(), 'Helpful tooltip text');
      });
    });
  },
};
