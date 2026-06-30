import { AppShellDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { appShellUIExample } from './AppShell.examples';

export const appShellExampleScenePart = {
  appShell: {
    locator: byDataTestId('app-shell'),
    driver: AppShellDriver,
  },
} satisfies ScenePart;

export const appShellExample: IExampleUnit<typeof appShellExampleScenePart, JSX.Element> = {
  ...appShellUIExample,
  scene: appShellExampleScenePart,
};

export const appShellExampleTestSuite: TestSuiteInfo<typeof appShellExample.scene> = {
  title: 'Astryx AppShell',
  url: '/app-shell',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${appShellExample.title}`, () => {
      const engine = useTestEngine(appShellExample.scene, getTestEngine, { beforeEach, afterEach });

      // The default variant reflects onto data-variant.
      test(`getVariant reads the default variant`, async () => {
        assertEqual(await engine().parts.appShell.getVariant(), 'elevated');
      });

      // The slotted topNav/sideNav and the role="main" content landmark are mounted.
      test(`header, side-nav and main regions are mounted`, async () => {
        assertTrue(await engine().parts.appShell.hasHeader());
        assertTrue(await engine().parts.appShell.hasSideNav());
        assertTrue(await engine().parts.appShell.hasMain());
      });

      // The main content text reads from the role="main" landmark.
      test(`getMainText reads the main landmark text`, async () => {
        assertTrue((await engine().parts.appShell.getMainText())?.includes('Main content here') ?? false);
      });

      // AppShell renders a built-in skip-to-content link.
      test(`hasSkipLink reports the built-in skip link`, async () => {
        assertTrue(await engine().parts.appShell.hasSkipLink());
      });
    });
  },
};
