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
  disabledDetails: {
    locator: byDataTestId('details-disabled'),
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

      // isDisabled (Astryx 0.1.8) reads aria-disabled; a non-disabled item is false.
      test(`isDisabled reflects the disabled item`, async () => {
        assertFalse(await engine().parts.details.isDisabled());
        assertTrue(await engine().parts.disabledDetails.isDisabled());
      });

      // A disabled item blocks the toggle entirely — clicking it is a no-op.
      test(`a disabled item stays collapsed when clicked`, async () => {
        assertFalse(await engine().parts.disabledDetails.isExpanded());
        await engine().parts.disabledDetails.click();
        assertFalse(await engine().parts.disabledDetails.isExpanded());
      });

      // The no-op contract holds for the higher-level toggles too, not just click:
      // expand/collapse route through the same disabled check, so neither waits on a
      // state the item can never reach.
      test(`expand and collapse are no-ops on a disabled item`, async () => {
        await engine().parts.disabledDetails.expand();
        assertFalse(await engine().parts.disabledDetails.isExpanded());
        await engine().parts.disabledDetails.collapse();
        assertFalse(await engine().parts.disabledDetails.isExpanded());
      });
    });
  },
};
