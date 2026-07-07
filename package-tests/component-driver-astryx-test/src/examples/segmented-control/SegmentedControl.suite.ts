import { SegmentedControlDriver } from '@atomic-testing/component-driver-astryx';
import { byAriaLabel, byRole, IExampleUnit, locatorUtil, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { segmentedControlUIExample } from './SegmentedControl.examples';

export const segmentedControlExampleScenePart = {
  // Role + verbatim accessible name — the role/name-first anchor Astryx needs.
  view: {
    locator: locatorUtil.append(byRole('radiogroup'), byAriaLabel('View mode', 'Same')),
    driver: SegmentedControlDriver,
  },
  density: {
    locator: locatorUtil.append(byRole('radiogroup'), byAriaLabel('Density', 'Same')),
    driver: SegmentedControlDriver,
  },
  lockedView: {
    locator: locatorUtil.append(byRole('radiogroup'), byAriaLabel('Locked view', 'Same')),
    driver: SegmentedControlDriver,
  },
} satisfies ScenePart;

export const segmentedControlExample: IExampleUnit<typeof segmentedControlExampleScenePart, JSX.Element> = {
  ...segmentedControlUIExample,
  scene: segmentedControlExampleScenePart,
};

export const segmentedControlExampleTestSuite: TestSuiteInfo<typeof segmentedControlExample.scene> = {
  title: 'Astryx SegmentedControl',
  url: '/segmented-control',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${segmentedControlExample.title}`, () => {
      const engine = useTestEngine(segmentedControlExample.scene, getTestEngine, { beforeEach, afterEach });

      // getValue reads the data-value of the aria-checked segment.
      test(`getValue returns the selected segment value`, async () => {
        assertEqual(await engine().parts.view.getValue(), 'grid');
      });

      // setValue clicks the matching segment; selection follows.
      test(`setValue selects the matching segment`, async () => {
        await engine().parts.view.setValue('list');
        assertEqual(await engine().parts.view.getValue(), 'list');
      });

      // getItemValues lists every segment's data-value in DOM order.
      test(`getItemValues lists all segment values`, async () => {
        assertEqual(await engine().parts.view.getItemValues(), ['grid', 'list', 'table']);
        assertEqual(await engine().parts.view.getItemCount(), 3);
      });

      // isItemDisabled reflects the per-segment aria-disabled flag.
      test(`isItemDisabled reflects the disabled segment`, async () => {
        assertTrue(await engine().parts.view.isItemDisabled('table'));
        assertFalse(await engine().parts.view.isItemDisabled('grid'));
      });

      // setValue refuses a disabled segment: it returns false and leaves the
      // selection unchanged (a disabled segment's click handler is a no-op).
      test(`setValue returns false for a disabled segment and keeps the selection`, async () => {
        assertFalse(await engine().parts.view.setValue('table'));
        assertEqual(await engine().parts.view.getValue(), 'grid');
      });

      // getLabel returns the group's accessible name.
      test(`getLabel returns the group accessible name`, async () => {
        assertEqual(await engine().parts.view.getLabel(), 'View mode');
      });

      // Two controls each resolve to their OWN group via the verbatim aria-label.
      test(`two controls disambiguate by accessible name`, async () => {
        assertEqual(await engine().parts.density.getValue(), 'comfortable');
        await engine().parts.view.setValue('grid');
        assertEqual(await engine().parts.view.getValue(), 'grid');
        assertEqual(await engine().parts.density.getValue(), 'comfortable');
      });

      // getDisabledMessage is a whole-group concept: the tooltip's
      // aria-describedby link composes onto the root radiogroup, distinct from a
      // per-segment isDisabled (no message). undefined when the group isn't
      // disabled with a message.
      test(`getDisabledMessage returns the group's disabled-reason tooltip text`, async () => {
        assertEqual(await engine().parts.lockedView.getDisabledMessage(), 'View mode is fixed for this workspace');
        assertEqual(await engine().parts.view.getDisabledMessage(), undefined);
      });
    });
  },
};
