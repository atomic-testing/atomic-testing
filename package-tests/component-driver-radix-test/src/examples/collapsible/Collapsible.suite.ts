import { CollapsibleDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { collapsibleUIExample } from './Collapsible.examples';

export const collapsibleExampleScenePart = {
  closed: {
    locator: byDataTestId('collapsible-closed'),
    driver: CollapsibleDriver,
  },
  open: {
    locator: byDataTestId('collapsible-open'),
    driver: CollapsibleDriver,
  },
} satisfies ScenePart;

export const collapsibleExample: IExampleUnit<typeof collapsibleExampleScenePart, JSX.Element> = {
  ...collapsibleUIExample,
  scene: collapsibleExampleScenePart,
};

export const collapsibleExampleTestSuite: TestSuiteInfo<typeof collapsibleExample.scene> = {
  title: 'Radix Collapsible',
  url: '/collapsible',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${collapsibleExample.title}`, () => {
      const engine = useTestEngine(collapsibleExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the default state per instance', async () => {
        assertFalse(await engine().parts.closed.isExpanded());
        assertTrue(await engine().parts.open.isExpanded());
      });

      test('reads the trigger text, unaffected by an inner button', async () => {
        assertEqual(await engine().parts.closed.getTriggerText(), 'Show details');
      });

      test('expands and collapses without disturbing the other instance', async () => {
        await engine().parts.closed.expand();
        assertTrue(await engine().parts.closed.isExpanded());
        assertTrue(await engine().parts.open.isExpanded());

        await engine().parts.closed.collapse();
        assertFalse(await engine().parts.closed.isExpanded());
        assertTrue(await engine().parts.open.isExpanded());
      });

      test('click() toggles the trigger', async () => {
        await engine().parts.open.click();
        assertFalse(await engine().parts.open.isExpanded());
      });
    });
  },
};
