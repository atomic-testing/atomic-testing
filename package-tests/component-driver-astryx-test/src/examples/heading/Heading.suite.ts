import { HeadingDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { headingUIExample } from './Heading.examples';

export const headingExampleScenePart = {
  plain: {
    locator: byDataTestId('heading-plain'),
    driver: HeadingDriver,
  },
  aria: {
    locator: byDataTestId('heading-aria'),
    driver: HeadingDriver,
  },
} satisfies ScenePart;

export const headingExample: IExampleUnit<typeof headingExampleScenePart, JSX.Element> = {
  ...headingUIExample,
  scene: headingExampleScenePart,
};

export const headingExampleTestSuite: TestSuiteInfo<typeof headingExample.scene> = {
  title: 'Astryx Heading',
  url: '/heading',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${headingExample.title}`, () => {
      const engine = useTestEngine(headingExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLevel reads the always-present data-level as a number; getText the content.
      test(`reads level and text`, async () => {
        assertEqual(await engine().parts.plain.getLevel(), 1);
        assertEqual(await engine().parts.plain.getText(), 'Page Title');
      });

      // With no accessibilityLevel override, aria-level is absent, so it falls back to level.
      test(`accessibility level falls back to level when not overridden`, async () => {
        assertEqual(await engine().parts.plain.getAccessibilityLevel(), 1);
      });

      // A level-2 heading with accessibilityLevel={3} keeps data-level=2 but aria-level=3.
      test(`accessibility level reflects the override`, async () => {
        assertEqual(await engine().parts.aria.getLevel(), 2);
        assertEqual(await engine().parts.aria.getAccessibilityLevel(), 3);
      });
    });
  },
};
