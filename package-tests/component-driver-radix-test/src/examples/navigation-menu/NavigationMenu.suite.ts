import { HTMLAnchorDriver } from '@atomic-testing/component-driver-html';
import { NavigationMenuDriver, NavigationMenuItemDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { navigationMenuUIExample } from './NavigationMenu.examples';

const learnContentPart = {
  gettingStarted: {
    locator: byDataTestId('navigation-menu-link-started'),
    driver: HTMLAnchorDriver,
  },
} satisfies ScenePart;

export const navigationMenuExampleScenePart = {
  nav: {
    locator: byDataTestId('navigation-menu-root'),
    driver: NavigationMenuDriver,
  },
  // The expandable item is anchored at its TRIGGER; its content re-parents
  // into the shared in-tree viewport and resolves through aria-controls (see
  // NavigationMenuItemDriver's class doc).
  learn: {
    locator: byDataTestId('navigation-menu-learn-trigger'),
    driver: NavigationMenuItemDriver<typeof learnContentPart>,
    option: {
      content: learnContentPart,
    },
  },
  // A plain NavigationMenu.Link item is an ordinary in-tree anchor.
  docsLink: {
    locator: byDataTestId('navigation-menu-docs-link'),
    driver: HTMLAnchorDriver,
  },
} satisfies ScenePart;

export const navigationMenuExample: IExampleUnit<typeof navigationMenuExampleScenePart, JSX.Element> = {
  ...navigationMenuUIExample,
  scene: navigationMenuExampleScenePart,
};

export const navigationMenuExampleTestSuite: TestSuiteInfo<typeof navigationMenuExample.scene> = {
  title: 'Radix NavigationMenu',
  url: '/navigation-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${navigationMenuExample.title}`, () => {
      const engine = useTestEngine(navigationMenuExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads root label and orientation', async () => {
        assertEqual(await engine().parts.nav.getLabel(), 'Main');
        assertEqual(await engine().parts.nav.getOrientation(), 'horizontal');
      });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.learn.isOpen());
      });

      test('reads the trigger label', async () => {
        assertEqual(await engine().parts.learn.getTriggerLabel(), 'Learn');
      });

      test('open() mounts the content into the viewport', async () => {
        await engine().parts.learn.open();
        await engine().parts.learn.waitForOpen();
        assertTrue(await engine().parts.learn.isOpen());
      });

      // Exercises the aria-controls -> byLinkedElement content resolution into
      // the shared viewport.
      test('reads a link inside the open content', async () => {
        await engine().parts.learn.open();
        await engine().parts.learn.waitForOpen();
        assertEqual(await engine().parts.learn.content.gettingStarted.getText(), 'Getting started');
      });

      test('close() unmounts the content', async () => {
        await engine().parts.learn.open();
        await engine().parts.learn.waitForOpen();
        await engine().parts.learn.close();
        await engine().parts.learn.waitForClose();
        assertFalse(await engine().parts.learn.isOpen());
      });

      test('a plain link item reads as an ordinary anchor', async () => {
        assertEqual(await engine().parts.docsLink.getText(), 'Docs');
      });
    });
  },
};
