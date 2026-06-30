import { PopoverDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { popoverUIExample } from './Popover.examples';

export const popoverExampleScenePart = {
  popover: {
    locator: byDataTestId('popover-trigger'),
    driver: PopoverDriver,
  },
} satisfies ScenePart;

export const popoverExample: IExampleUnit<typeof popoverExampleScenePart, JSX.Element> = {
  ...popoverUIExample,
  scene: popoverExampleScenePart,
};

export const popoverExampleTestSuite: TestSuiteInfo<typeof popoverExample.scene> = {
  title: 'Astryx Popover',
  url: '/popover',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${popoverExample.title}`, () => {
      const engine = useTestEngine(popoverExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // The panel content is always mounted, so label/content read while closed.
      test(`getLabel and getContent read the panel`, async () => {
        assertEqual(await engine().parts.popover.getLabel(), 'Settings');
        assertEqual(await engine().parts.popover.getContent(), 'Adjust your preferences here.');
      });

      // open()/close() toggle the trigger; isOpen reads aria-expanded.
      // WebKit can't drive native-popover open/close (see skipInteractionOnWebkit).
      test(`open and close toggle the popover`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.popover.isOpen());
        await engine().parts.popover.open();
        assertTrue(await engine().parts.popover.isOpen());
        await engine().parts.popover.close();
        assertFalse(await engine().parts.popover.isOpen());
      });
    });
  },
};
