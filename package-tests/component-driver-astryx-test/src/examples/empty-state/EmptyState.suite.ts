import { EmptyStateDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { emptyStateUIExample } from './EmptyState.examples';

export const emptyStateExampleScenePart = {
  basic: {
    locator: byDataTestId('empty-basic'),
    driver: EmptyStateDriver,
  },
  withAction: {
    locator: byDataTestId('empty-with-action'),
    driver: EmptyStateDriver,
  },
} satisfies ScenePart;

export const emptyStateExample: IExampleUnit<typeof emptyStateExampleScenePart, JSX.Element> = {
  ...emptyStateUIExample,
  scene: emptyStateExampleScenePart,
};

export const emptyStateExampleTestSuite: TestSuiteInfo<typeof emptyStateExample.scene> = {
  title: 'Astryx EmptyState',
  url: '/empty-state',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${emptyStateExample.title}`, () => {
      const engine = useTestEngine(emptyStateExample.scene, getTestEngine, { beforeEach, afterEach });

      // getTitle / getDescription read the heading and paragraph text.
      test(`reads the title and description`, async () => {
        assertEqual(await engine().parts.basic.getTitle(), 'No results found');
        assertEqual(await engine().parts.basic.getDescription(), 'Try adjusting your search or filters.');
      });

      // The default heading level is 3; headingLevel={2} renders an <h2>.
      test(`getHeadingLevel reflects the rendered heading tag`, async () => {
        assertEqual(await engine().parts.basic.getHeadingLevel(), 3);
        assertEqual(await engine().parts.withAction.getHeadingLevel(), 2);
      });

      // hasAction is true only for the instance given an actions button.
      test(`hasAction distinguishes the actioned instance`, async () => {
        assertFalse(await engine().parts.basic.hasAction());
        assertTrue(await engine().parts.withAction.hasAction());
      });

      // isPresent mirrors exists for a rendered empty state.
      test(`isPresent is true when rendered`, async () => {
        assertTrue(await engine().parts.basic.isPresent());
      });
    });
  },
};
