import { CheckboxListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { checkboxListUIExample } from './CheckboxList.examples';

export const checkboxListExampleScenePart = {
  notifs: {
    locator: byDataTestId('notifs'),
    driver: CheckboxListDriver,
  },
} satisfies ScenePart;

export const checkboxListExample: IExampleUnit<typeof checkboxListExampleScenePart, JSX.Element> = {
  ...checkboxListUIExample,
  scene: checkboxListExampleScenePart,
};

export const checkboxListExampleTestSuite: TestSuiteInfo<typeof checkboxListExample.scene> = {
  title: 'Astryx CheckboxList',
  url: '/checkbox-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${checkboxListExample.title}`, () => {
      const engine = useTestEngine(checkboxListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getItemLabels lists every row label; getItemCount counts them.
      test(`getItemLabels and getItemCount enumerate the rows`, async () => {
        assertEqual(await engine().parts.notifs.getItemLabels(), ['Email', 'SMS', 'Push']);
        assertEqual(await engine().parts.notifs.getItemCount(), 3);
      });

      // getCheckedLabels and isItemChecked reflect the initial selection.
      test(`checked state reflects the value`, async () => {
        assertEqual(await engine().parts.notifs.getCheckedLabels(), ['Email']);
        assertTrue(await engine().parts.notifs.isItemChecked('Email'));
        assertFalse(await engine().parts.notifs.isItemChecked('SMS'));
      });

      // checkItemByLabel adds a row to the selection.
      test(`checkItemByLabel checks a row`, async () => {
        assertTrue(await engine().parts.notifs.checkItemByLabel('SMS'));
        assertTrue(await engine().parts.notifs.isItemChecked('SMS'));
      });

      // uncheckItemByLabel removes a row from the selection.
      test(`uncheckItemByLabel unchecks a row`, async () => {
        assertTrue(await engine().parts.notifs.uncheckItemByLabel('Email'));
        assertFalse(await engine().parts.notifs.isItemChecked('Email'));
      });
    });
  },
};
