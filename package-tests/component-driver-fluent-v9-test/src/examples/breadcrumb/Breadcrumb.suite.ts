import { BreadcrumbDriver, BreadcrumbItemNotFoundError } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { breadcrumbUIExample } from './Breadcrumb.examples';

export const breadcrumbExampleScenePart = {
  breadcrumbA: { locator: byDataTestId('breadcrumb-a'), driver: BreadcrumbDriver },
  breadcrumbB: { locator: byDataTestId('breadcrumb-b'), driver: BreadcrumbDriver },
} satisfies ScenePart;

export const breadcrumbExample: IExampleUnit<typeof breadcrumbExampleScenePart, JSX.Element> = {
  ...breadcrumbUIExample,
  scene: breadcrumbExampleScenePart,
};

export const breadcrumbExampleTestSuite: TestSuiteInfo<typeof breadcrumbExample.scene> = {
  title: 'Fluent Breadcrumb',
  url: '/breadcrumb',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${breadcrumbExample.title}`, () => {
      const engine = useTestEngine(breadcrumbExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts and labels items per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.breadcrumbA.getItemCount(), 3);
        assertEqual(await engine().parts.breadcrumbA.getItemLabels(), ['Home', 'Library', 'Data']);

        assertEqual(await engine().parts.breadcrumbB.getItemCount(), 2);
        assertEqual(await engine().parts.breadcrumbB.getItemLabels(), ['Root', 'Locked']);
      });

      test('getItemByIndex/getItemByLabel resolve items, or null when absent', async () => {
        const home = await engine().parts.breadcrumbA.getItemByIndex(0);
        assertEqual(await home?.getLabel(), 'Home');
        assertEqual(await engine().parts.breadcrumbA.getItemByIndex(99), null);

        const library = await engine().parts.breadcrumbA.getItemByLabel('Library');
        assertEqual(await library?.getButton().getHref(), '/home/library');
        assertEqual(await engine().parts.breadcrumbA.getItemByLabel('Nonexistent'), null);
      });

      test('getCurrentItem finds the crumb marked current, or null when none is', async () => {
        const current = await engine().parts.breadcrumbA.getCurrentItem();
        assertEqual(await current?.getLabel(), 'Data');

        assertEqual(await engine().parts.breadcrumbB.getCurrentItem(), null);
      });

      test('isDisabled reflects the disabled crumb only', async () => {
        const root = await engine().parts.breadcrumbB.getItemByIndex(0);
        assertFalse(await root!.getButton().isDisabled());

        const locked = await engine().parts.breadcrumbB.getItemByIndex(1);
        assertTrue(await locked!.getButton().isDisabled());
      });

      test('selectByLabel clicks the matching item without throwing', async () => {
        await engine().parts.breadcrumbA.selectByLabel('Library');
        await engine().parts.breadcrumbB.selectByLabel('Root');
      });

      test('selectByLabel throws BreadcrumbItemNotFoundError when no item matches', async () => {
        let threw = false;
        try {
          await engine().parts.breadcrumbA.selectByLabel('Nonexistent');
        } catch (error) {
          threw = error instanceof BreadcrumbItemNotFoundError;
        }
        assertTrue(threw);
      });
    });
  },
};
