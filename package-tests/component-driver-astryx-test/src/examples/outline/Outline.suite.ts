import { OutlineDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { outlineUIExample } from './Outline.examples';

export const outlineExampleScenePart = {
  docToc: {
    locator: byDataTestId('doc-toc'),
    driver: OutlineDriver,
  },
  guideToc: {
    locator: byDataTestId('guide-toc'),
    driver: OutlineDriver,
  },
} satisfies ScenePart;

export const outlineExample: IExampleUnit<typeof outlineExampleScenePart, JSX.Element> = {
  ...outlineUIExample,
  scene: outlineExampleScenePart,
};

export const outlineExampleTestSuite: TestSuiteInfo<typeof outlineExample.scene> = {
  title: 'Astryx Outline',
  url: '/outline',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${outlineExample.title}`, () => {
      const engine = useTestEngine(outlineExample.scene, getTestEngine, { beforeEach, afterEach });

      // getItemLabels lists the entries; the two outlines stay independent.
      test(`enumerates entries per outline`, async () => {
        assertEqual(await engine().parts.docToc.getItemLabels(), ['Introduction', 'Features', 'API']);
        assertEqual(await engine().parts.guideToc.getItemLabels(), ['Install', 'Usage']);
      });

      // getActiveLabel reads the aria-current entry.
      test(`reads the active entry`, async () => {
        assertEqual(await engine().parts.docToc.getActiveLabel(), 'Features');
        assertEqual(await engine().parts.guideToc.getActiveLabel(), 'Install');
      });

      // getHref / getLevel read the anchor's target and depth.
      test(`reads href and level`, async () => {
        assertEqual(await engine().parts.docToc.getHref('Introduction'), '#intro');
        assertEqual(await engine().parts.docToc.getLevel('Features'), 2);
        assertEqual(await engine().parts.docToc.getLevel('API'), 1);
      });

      // clickItem activates the named entry and reports unknown labels.
      test(`clickItem reports unknown labels`, async () => {
        assertFalse(await engine().parts.docToc.clickItem('Nope'));
        assertTrue(await engine().parts.docToc.clickItem('API'));
      });
    });
  },
};
