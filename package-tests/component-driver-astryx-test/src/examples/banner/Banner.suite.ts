import { BannerDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { bannerUIExample } from './Banner.examples';

export const bannerExampleScenePart = {
  infoBanner: {
    locator: byDataTestId('info-banner'),
    driver: BannerDriver,
  },
  errorBanner: {
    locator: byDataTestId('error-banner'),
    driver: BannerDriver,
  },
  expandableBanner: {
    locator: byDataTestId('expandable-banner'),
    driver: BannerDriver,
  },
} satisfies ScenePart;

export const bannerExample: IExampleUnit<typeof bannerExampleScenePart, JSX.Element> = {
  ...bannerUIExample,
  scene: bannerExampleScenePart,
};

export const bannerExampleTestSuite: TestSuiteInfo<typeof bannerExample.scene> = {
  title: 'Astryx Banner',
  url: '/banner',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${bannerExample.title}`, () => {
      const engine = useTestEngine(bannerExample.scene, getTestEngine, { beforeEach, afterEach });

      // getTitle/getDescription read the header paragraphs; getStatus the severity.
      test(`getTitle/getDescription/getStatus read the banner`, async () => {
        assertEqual(await engine().parts.infoBanner.getTitle(), 'Update available');
        assertEqual(await engine().parts.infoBanner.getDescription(), 'A new version is ready.');
        assertEqual(await engine().parts.infoBanner.getStatus(), 'info');
        assertEqual(await engine().parts.errorBanner.getStatus(), 'error');
      });

      // toggleExpand flips the collapsible content's aria-expanded.
      test(`toggleExpand flips the expanded state`, async () => {
        assertFalse(await engine().parts.expandableBanner.isExpanded());
        await engine().parts.expandableBanner.toggleExpand();
        assertTrue(await engine().parts.expandableBanner.isExpanded());
      });

      // dismiss removes the banner — Astryx unmounts it, so isDismissed flips true.
      test(`dismiss removes the banner`, async () => {
        assertFalse(await engine().parts.errorBanner.isDismissed());
        await engine().parts.errorBanner.dismiss();
        const dismissed = await engine().parts.errorBanner.waitUntil({
          probeFn: () => engine().parts.errorBanner.isDismissed(),
          terminateCondition: true,
          timeoutMs: 2000,
        });
        assertTrue(dismissed);
      });
    });
  },
};
