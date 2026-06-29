import { CollapsibleDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { collapsibleUIExample } from './Collapsible.examples';

export const collapsibleExampleScenePart = {
  details: {
    locator: byDataTestId('details'),
    driver: CollapsibleDriver,
  },
} satisfies ScenePart;

export const collapsibleExample: IExampleUnit<typeof collapsibleExampleScenePart, JSX.Element> = {
  ...collapsibleUIExample,
  scene: collapsibleExampleScenePart,
};

export const collapsibleExampleTestSuite: TestSuiteInfo<typeof collapsibleExample.scene> = {
  title: 'Astryx Collapsible',
  url: '/collapsible',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${collapsibleExample.title}`, () => {
      const engine = useTestEngine(collapsibleExample.scene, getTestEngine, { beforeEach, afterEach });

      // getTriggerText reads the trigger's visible label; starts collapsed.
      test(`getTriggerText and initial collapsed state`, async () => {
        assertEqual(await engine().parts.details.getTriggerText(), 'Details');
        assertFalse(await engine().parts.details.isExpanded());
      });

      // expand opens; collapse closes — both read back via aria-expanded.
      test(`expand and collapse toggle the content`, async () => {
        await engine().parts.details.expand();
        assertTrue(await engine().parts.details.isExpanded());
        await engine().parts.details.collapse();
        assertFalse(await engine().parts.details.isExpanded());
      });
    });
  },
};
