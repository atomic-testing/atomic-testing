import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { PopoverDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { popoverUIExample } from './Popover.examples';

const popoverContentPart = {
  close: {
    locator: byDataTestId('popover-close'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const popoverExampleScenePart = {
  // PopoverDriver is anchored at the TRIGGER (not the content) — see its class
  // doc comment for why: Popover.Content shares role="dialog" with modal
  // Dialog.Content, so the driver derives the portalled content locator from
  // this trigger's aria-controls at call time instead of a static portal re-root.
  popover: {
    locator: byDataTestId('popover-trigger'),
    driver: PopoverDriver<typeof popoverContentPart>,
    option: {
      content: popoverContentPart,
    },
  },
} satisfies ScenePart;

export const popoverExample: IExampleUnit<typeof popoverExampleScenePart, JSX.Element> = {
  ...popoverUIExample,
  scene: popoverExampleScenePart,
};

export const popoverExampleTestSuite: TestSuiteInfo<typeof popoverExample.scene> = {
  title: 'Radix Popover',
  url: '/popover',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe(`${popoverExample.title}`, () => {
      const engine = useTestEngine(popoverExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.popover.isOpen());
      });

      test('open() mounts the content', async () => {
        await engine().parts.popover.open();
        await engine().parts.popover.waitForOpen();
        assertTrue(await engine().parts.popover.isOpen());
      });

      test('close() unmounts the content', async () => {
        await engine().parts.popover.open();
        await engine().parts.popover.waitForOpen();
        await engine().parts.popover.close();
        await engine().parts.popover.waitForClose();
        assertFalse(await engine().parts.popover.isOpen());
      });

      // Exercises the aria-controls -> byLinkedElement content resolution: the
      // close button only resolves once open() has populated aria-controls.
      test('the linked content close button closes the popover', async () => {
        await engine().parts.popover.open();
        await engine().parts.popover.waitForOpen();
        await engine().parts.popover.content.close.click();
        await engine().parts.popover.waitForClose();
        assertFalse(await engine().parts.popover.isOpen());
      });

      test('pressing Escape closes the popover', async () => {
        await engine().parts.popover.open();
        await engine().parts.popover.waitForOpen();
        const closed = await engine().parts.popover.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.popover.isOpen());
      });
    });
  },
};
