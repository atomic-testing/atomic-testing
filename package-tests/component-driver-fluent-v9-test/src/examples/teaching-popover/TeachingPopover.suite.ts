import { ButtonDriver, TeachingPopoverDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { teachingPopoverUIExample } from './TeachingPopover.examples';

const teachingPopoverContentPart = {
  next: { locator: byDataTestId('teaching-popover-next'), driver: ButtonDriver },
} satisfies ScenePart;

export const teachingPopoverExampleScenePart = {
  trigger: { locator: byDataTestId('teaching-popover-trigger'), driver: ButtonDriver },
  popover: {
    locator: byDataTestId('teaching-popover'),
    driver: TeachingPopoverDriver<typeof teachingPopoverContentPart>,
    option: { content: teachingPopoverContentPart },
  },
} satisfies ScenePart;

export const teachingPopoverExample: IExampleUnit<typeof teachingPopoverExampleScenePart, JSX.Element> = {
  ...teachingPopoverUIExample,
  scene: teachingPopoverExampleScenePart,
};

export const teachingPopoverExampleTestSuite: TestSuiteInfo<typeof teachingPopoverExample.scene> = {
  title: 'Fluent TeachingPopover',
  url: '/teaching-popover',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Fluent TeachingPopover', () => {
      const engine = useTestEngine(teachingPopoverExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.popover.isOpen());
      });

      test('opens via trigger and reads header/title/body', async () => {
        await engine().parts.trigger.click();
        assertTrue(await engine().parts.popover.waitForOpen());
        assertEqual(await engine().parts.popover.getHeaderText(), 'New feature');
        assertEqual(await engine().parts.popover.getTitle(), 'Try the new toolbar');
        assertEqual(await engine().parts.popover.getBodyText(), 'The toolbar now supports quick actions.');
      });

      test('reads consumer-declared footer content', async () => {
        await engine().parts.trigger.click();
        await engine().parts.popover.waitForOpen();
        assertEqual(await engine().parts.popover.content.next.getText(), 'Next');
      });

      test('dismisses via the built-in dismiss button', async () => {
        await engine().parts.trigger.click();
        await engine().parts.popover.waitForOpen();
        assertTrue(await engine().parts.popover.dismiss());
        assertFalse(await engine().parts.popover.isOpen());
      });
    });
  },
};
