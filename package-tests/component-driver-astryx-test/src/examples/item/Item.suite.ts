import { ItemDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { itemUIExample } from './Item.examples';

export const itemExampleScenePart = {
  basic: {
    locator: byDataTestId('item-basic'),
    driver: ItemDriver,
  },
  selected: {
    locator: byDataTestId('item-li'),
    driver: ItemDriver,
  },
} satisfies ScenePart;

export const itemExample: IExampleUnit<typeof itemExampleScenePart, JSX.Element> = {
  ...itemUIExample,
  scene: itemExampleScenePart,
};

export const itemExampleTestSuite: TestSuiteInfo<typeof itemExample.scene> = {
  title: 'Astryx Item',
  url: '/item',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${itemExample.title}`, () => {
      const engine = useTestEngine(itemExample.scene, getTestEngine, { beforeEach, afterEach });

      // density/align come from the root data-* attributes; the label is the text content.
      test(`reads the density, align, and label`, async () => {
        assertTrue((await engine().parts.basic.getLabel())?.includes('John Doe') ?? false);
        assertEqual(await engine().parts.basic.getDensity(), 'balanced');
        assertEqual(await engine().parts.basic.getAlign(), 'center');
      });

      // aria-selected is emitted only on an <li> root, so the <div> item is never selected.
      test(`isSelected is true only for the selected <li> item`, async () => {
        assertFalse(await engine().parts.basic.isSelected());
        assertTrue(await engine().parts.selected.isSelected());
      });

      // Neither item is a link, so getHref is undefined.
      test(`getHref is undefined for non-link items`, async () => {
        assertEqual(await engine().parts.basic.getHref(), undefined);
      });
    });
  },
};
