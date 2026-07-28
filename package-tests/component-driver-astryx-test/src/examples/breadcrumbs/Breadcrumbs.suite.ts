import { BreadcrumbsDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { breadcrumbsUIExample } from './Breadcrumbs.examples';

export const breadcrumbsExampleScenePart = {
  breadcrumbs: {
    locator: byDataTestId('breadcrumbs'),
    driver: BreadcrumbsDriver,
  },
} satisfies ScenePart;

export const breadcrumbsExample: IExampleUnit<typeof breadcrumbsExampleScenePart, JSX.Element> = {
  ...breadcrumbsUIExample,
  scene: breadcrumbsExampleScenePart,
};

export const breadcrumbsExampleTestSuite: TestSuiteInfo<typeof breadcrumbsExample.scene> = {
  title: 'Astryx Breadcrumbs',
  url: '/breadcrumbs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${breadcrumbsExample.title}`, () => {
      const engine = useTestEngine(breadcrumbsExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      test(`getLabel and getItemCount read the trail`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getLabel(), 'Breadcrumb');
        assertEqual(await engine().parts.breadcrumbs.getItemCount(), 4);
      });

      test(`getLabels reads every crumb in order`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getLabels(), ['Home', 'Projects', 'Switch project', 'My Project']);
      });

      // getCurrentLabel reads the inner [aria-current="page"] span, not the <li>.
      test(`getCurrentLabel reads the current crumb`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getCurrentLabel(), 'My Project');
      });

      // Only linked crumbs contribute an href; the menu trigger and current crumb
      // (a span) are both skipped.
      test(`getHrefs reads the linked crumbs only`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getHrefs(), ['/', '/projects']);
      });

      // hasMenu (Astryx 0.1.9's `menu` prop) is true only for the menu crumb.
      test(`hasMenu is true only for the menu crumb`, async () => {
        const menuCrumb = await engine().parts.breadcrumbs.getItemByLabel('Switch project');
        const linkCrumb = await engine().parts.breadcrumbs.getItemByLabel('Projects');
        assertTrue((await menuCrumb?.hasMenu()) ?? false);
        assertFalse((await linkCrumb?.hasMenu()) ?? true);
      });

      // menu() reaches the crumb's popover via its aria-controls, reusing the
      // DropdownMenu item pipeline; items are always mounted, so labels read
      // while closed. Opening it is gated on WebKit like the other native-popover
      // triggers (see DropdownMenu.suite.ts).
      test(`menu exposes the crumb's dropdown items`, async () => {
        const menuCrumb = await engine().parts.breadcrumbs.getItemByLabel('Switch project');
        assertEqual(await menuCrumb?.menu().getItemLabels(), ['Settings', 'Archive']);

        if (skipInteractionOnWebkit(test, browser())) return;
        await menuCrumb?.menu().open();
        assertTrue(await menuCrumb!.menu().selectByLabel('Archive'));
      });
    });
  },
};
