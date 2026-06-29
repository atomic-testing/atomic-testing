import { BreadcrumbsDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${breadcrumbsExample.title}`, () => {
      const engine = useTestEngine(breadcrumbsExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`getLabel and getItemCount read the trail`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getLabel(), 'Breadcrumb');
        assertEqual(await engine().parts.breadcrumbs.getItemCount(), 3);
      });

      test(`getLabels reads every crumb in order`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getLabels(), ['Home', 'Projects', 'My Project']);
      });

      // getCurrentLabel reads the inner [aria-current="page"] span, not the <li>.
      test(`getCurrentLabel reads the current crumb`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getCurrentLabel(), 'My Project');
      });

      // Only linked crumbs contribute an href; the current crumb (a span) is skipped.
      test(`getHrefs reads the linked crumbs only`, async () => {
        assertEqual(await engine().parts.breadcrumbs.getHrefs(), ['/', '/projects']);
      });
    });
  },
};
