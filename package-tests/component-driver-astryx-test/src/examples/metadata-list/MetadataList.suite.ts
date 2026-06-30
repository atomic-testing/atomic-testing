import { MetadataListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { metadataListUIExample } from './MetadataList.examples';

export const metadataListExampleScenePart = {
  details: {
    locator: byDataTestId('details'),
    driver: MetadataListDriver,
  },
  release: {
    locator: byDataTestId('release'),
    driver: MetadataListDriver,
  },
} satisfies ScenePart;

export const metadataListExample: IExampleUnit<typeof metadataListExampleScenePart, JSX.Element> = {
  ...metadataListUIExample,
  scene: metadataListExampleScenePart,
};

export const metadataListExampleTestSuite: TestSuiteInfo<typeof metadataListExample.scene> = {
  title: 'Astryx MetadataList',
  url: '/metadata-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${metadataListExample.title}`, () => {
      const engine = useTestEngine(metadataListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabels / getEntryCount enumerate the dt/dd pairs; getValueByLabel reads a value.
      test(`enumerates entries and reads values`, async () => {
        assertEqual(await engine().parts.details.getLabels(), ['Status', 'Owner', 'Total']);
        assertEqual(await engine().parts.details.getEntryCount(), 3);
        assertEqual(await engine().parts.details.getValueByLabel('Owner'), 'Alice');
        assertEqual(await engine().parts.details.getValueByLabel('Total'), '$42.00');
      });

      // An unknown label has no value.
      test(`getValueByLabel returns undefined for unknown labels`, async () => {
        assertEqual(await engine().parts.details.getValueByLabel('Nope'), undefined);
      });

      // A static list has no toggle, so it is never "expanded".
      test(`static list is not expandable`, async () => {
        assertFalse(await engine().parts.details.isExpanded());
      });

      // A collapsed list renders only maxNumOfItems entries until expanded.
      test(`showMore reveals the collapsed entries`, async () => {
        assertEqual(await engine().parts.release.getEntryCount(), 2);
        assertEqual(await engine().parts.release.getLabels(), ['Version', 'Channel']);
        assertFalse(await engine().parts.release.isExpanded());

        await engine().parts.release.showMore();
        assertTrue(await engine().parts.release.isExpanded());
        assertEqual(await engine().parts.release.getEntryCount(), 4);
        assertEqual(await engine().parts.release.getValueByLabel('License'), 'MIT');

        await engine().parts.release.showLess();
        assertFalse(await engine().parts.release.isExpanded());
        assertEqual(await engine().parts.release.getEntryCount(), 2);
      });
    });
  },
};
