import { ListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { listUIExample } from './List.examples';

export const listExampleScenePart = {
  settings: {
    locator: byDataTestId('settings'),
    driver: ListDriver,
  },
  steps: {
    locator: byDataTestId('steps'),
    driver: ListDriver,
  },
} satisfies ScenePart;

export const listExample: IExampleUnit<typeof listExampleScenePart, JSX.Element> = {
  ...listUIExample,
  scene: listExampleScenePart,
};

export const listExampleTestSuite: TestSuiteInfo<typeof listExample.scene> = {
  title: 'Astryx List',
  url: '/list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${listExample.title}`, () => {
      const engine = useTestEngine(listExample.scene, getTestEngine, { beforeEach, afterEach });

      // getItemLabels / getItemCount enumerate the rows of each list independently.
      test(`enumerates rows per list`, async () => {
        assertEqual(await engine().parts.settings.getItemLabels(), ['Profile', 'Privacy', 'Docs', 'Archived']);
        assertEqual(await engine().parts.settings.getItemCount(), 4);
        assertEqual(await engine().parts.steps.getItemLabels(), ['First step', 'Second step']);
      });

      // Selected / disabled state is read from ARIA on the row.
      test(`reads selected and disabled state`, async () => {
        assertEqual(await engine().parts.settings.getSelectedLabels(), ['Profile']);
        assertTrue(await engine().parts.settings.isItemSelected('Profile'));
        assertFalse(await engine().parts.settings.isItemSelected('Privacy'));
        assertTrue(await engine().parts.settings.isItemDisabled('Archived'));
        assertFalse(await engine().parts.settings.isItemDisabled('Profile'));
      });

      // A row with an href renders as a link the driver can read.
      test(`reads link rows`, async () => {
        const docs = await engine().parts.settings.getItemByLabel('Docs');
        assertTrue(docs != null && (await docs.isLink()));
        assertEqual(docs != null ? await docs.getHref() : undefined, '/docs');
      });

      // isOrdered distinguishes <ol> (decimal) from <ul>.
      test(`isOrdered distinguishes ordered lists`, async () => {
        assertFalse(await engine().parts.settings.isOrdered());
        assertTrue(await engine().parts.steps.isOrdered());
      });

      // clickItem returns false for an unknown label.
      test(`clickItem reports unknown labels`, async () => {
        assertFalse(await engine().parts.settings.clickItem('Nope'));
        assertTrue(await engine().parts.settings.clickItem('Privacy'));
      });
    });
  },
};
