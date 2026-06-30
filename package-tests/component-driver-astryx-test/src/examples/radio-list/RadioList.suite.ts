import { RadioListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { radioListUIExample } from './RadioList.examples';

export const radioListExampleScenePart = {
  prefs: {
    locator: byDataTestId('prefs'),
    driver: RadioListDriver,
  },
} satisfies ScenePart;

export const radioListExample: IExampleUnit<typeof radioListExampleScenePart, JSX.Element> = {
  ...radioListUIExample,
  scene: radioListExampleScenePart,
};

export const radioListExampleTestSuite: TestSuiteInfo<typeof radioListExample.scene> = {
  title: 'Astryx RadioList',
  url: '/radio-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${radioListExample.title}`, () => {
      const engine = useTestEngine(radioListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getSelectedValue reads the checked radio's value.
      test(`getSelectedValue returns the checked value`, async () => {
        assertEqual(await engine().parts.prefs.getSelectedValue(), 'email');
      });

      // selectByValue clicks the matching radio.
      test(`selectByValue changes the selection`, async () => {
        await engine().parts.prefs.selectByValue('sms');
        assertEqual(await engine().parts.prefs.getSelectedValue(), 'sms');
        assertTrue(await engine().parts.prefs.isItemChecked('sms'));
        assertFalse(await engine().parts.prefs.isItemChecked('email'));
      });

      // getItemValues lists every radio value; getItemCount counts them.
      test(`getItemValues and getItemCount enumerate the options`, async () => {
        assertEqual(await engine().parts.prefs.getItemValues(), ['email', 'sms', 'push']);
        assertEqual(await engine().parts.prefs.getItemCount(), 3);
      });

      // getLabel returns the group label; isRequired is false when not required.
      test(`getLabel and isRequired read the group state`, async () => {
        assertEqual(await engine().parts.prefs.getLabel(), 'Notification preference');
        assertFalse(await engine().parts.prefs.isRequired());
      });
    });
  },
};
