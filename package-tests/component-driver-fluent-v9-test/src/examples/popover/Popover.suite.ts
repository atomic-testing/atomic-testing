import { ButtonDriver, PopoverDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { popoverUIExample } from './Popover.examples';

export const popoverExampleScenePart = {
  aTrigger: { locator: byDataTestId('popover-a-trigger'), driver: ButtonDriver },
  popoverA: { locator: byDataTestId('popover-a'), driver: PopoverDriver },
  bTrigger: { locator: byDataTestId('popover-b-trigger'), driver: ButtonDriver },
  popoverB: { locator: byDataTestId('popover-b'), driver: PopoverDriver },
} satisfies ScenePart;

export const popoverExample: IExampleUnit<typeof popoverExampleScenePart, JSX.Element> = {
  ...popoverUIExample,
  scene: popoverExampleScenePart,
};

export const popoverExampleTestSuite: TestSuiteInfo<typeof popoverExample.scene> = {
  title: 'Fluent Popover',
  url: '/popover',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Fluent Popover', () => {
      const engine = useTestEngine(popoverExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('popover is not open initially', async () => {
        assertFalse(await engine().parts.popoverA.isOpen());
      });

      test('opens by clicking its trigger', async () => {
        await engine().parts.aTrigger.click();
        assertTrue(await engine().parts.popoverA.waitForOpen());
      });

      test('closes via Escape', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.popoverA.waitForOpen();
        assertTrue(await engine().parts.popoverA.closeByEscape());
        assertFalse(await engine().parts.popoverA.isOpen());
      });

      test('two simultaneously open popovers disambiguate correctly', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.popoverA.waitForOpen();
        await engine().parts.bTrigger.click();
        await engine().parts.popoverB.waitForOpen();

        assertEqual(await engine().parts.popoverA.getText(), 'Popover A content');
        assertEqual(await engine().parts.popoverB.getText(), 'Popover B content');
      });

      test('closing one of two open popovers leaves the other open', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.popoverA.waitForOpen();
        await engine().parts.bTrigger.click();
        await engine().parts.popoverB.waitForOpen();

        // Escape dismisses the topmost stacked popover (the last one opened) —
        // see PopoverDriver.closeByEscape's class doc.
        assertTrue(await engine().parts.popoverB.closeByEscape());
        assertFalse(await engine().parts.popoverB.isOpen());
        assertTrue(await engine().parts.popoverA.isOpen());
      });
    });
  },
};
