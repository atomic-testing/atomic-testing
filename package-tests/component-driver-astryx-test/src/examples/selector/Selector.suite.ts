import { SelectorDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { selectorUIExample } from './Selector.examples';

export const selectorExampleScenePart = {
  fruit: {
    locator: byDataTestId('fruit'),
    driver: SelectorDriver,
  },
  size: {
    locator: byDataTestId('size'),
    driver: SelectorDriver,
  },
} satisfies ScenePart;

export const selectorExample: IExampleUnit<typeof selectorExampleScenePart, JSX.Element> = {
  ...selectorUIExample,
  scene: selectorExampleScenePart,
};

export const selectorExampleTestSuite: TestSuiteInfo<typeof selectorExample.scene> = {
  title: 'Astryx Selector',
  url: '/selector',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${selectorExample.title}`, () => {
      const engine = useTestEngine(selectorExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // getSelectedLabel reads the trigger text without opening; the two selectors stay independent.
      test(`reads the selected label`, async () => {
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
        assertEqual(await engine().parts.size.getSelectedLabel(), 'Medium');
      });

      // open()/close() toggle the popup; isExpanded reads aria-expanded. (native-popover → not WebKit)
      test(`open and close toggle the popup`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.fruit.isExpanded());
        await engine().parts.fruit.open();
        assertTrue(await engine().parts.fruit.isExpanded());
        await engine().parts.fruit.close();
        assertFalse(await engine().parts.fruit.isExpanded());
      });

      // getOptionLabels enumerates the options (across sections); isOptionSelected reads aria-selected.
      test(`enumerates options and reads selected option`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertEqual(await engine().parts.fruit.getOptionLabels(), ['Apple', 'Banana', 'Cherry']);
        assertTrue(await engine().parts.fruit.isOptionSelected('Banana'));
        assertFalse(await engine().parts.fruit.isOptionSelected('Apple'));
      });

      // selectByLabel picks an option and updates the trigger; unknown labels return false.
      test(`selectByLabel changes the selection`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.fruit.selectByLabel('Nope'));
        assertTrue(await engine().parts.fruit.selectByLabel('Apple'));
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Apple');
      });
    });
  },
};
