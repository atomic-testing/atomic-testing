import { TypeaheadDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { typeaheadUIExample } from './Typeahead.examples';

export const typeaheadExampleScenePart = {
  fruit: {
    locator: byDataTestId('fruit-search'),
    driver: TypeaheadDriver,
  },
  city: {
    locator: byDataTestId('city-search'),
    driver: TypeaheadDriver,
  },
} satisfies ScenePart;

export const typeaheadExample: IExampleUnit<typeof typeaheadExampleScenePart, JSX.Element> = {
  ...typeaheadUIExample,
  scene: typeaheadExampleScenePart,
};

export const typeaheadExampleTestSuite: TestSuiteInfo<typeof typeaheadExample.scene> = {
  title: 'Astryx Typeahead',
  url: '/typeahead',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${typeaheadExample.title}`, () => {
      const engine = useTestEngine(typeaheadExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // Typing runs the (debounced, async) search; getResultLabels waits for the results.
      test(`search lists matching results`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.fruit.type('ap');
        const labels = await engine().parts.fruit.getResultLabels();
        assertTrue(labels.includes('Apple'));
        assertTrue(labels.includes('Grape'));
        assertFalse(labels.includes('Banana'));
        assertEqual(await engine().parts.fruit.getQuery(), 'ap');
        assertTrue(await engine().parts.fruit.isExpanded());
        assertFalse(await engine().parts.fruit.isLoading());
      });

      // selectByLabel picks a result; an unknown label returns false.
      test(`selectByLabel picks a result`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.fruit.type('ap');
        assertFalse(await engine().parts.fruit.selectByLabel('Nope'));
        assertTrue(await engine().parts.fruit.selectByLabel('Apple'));
      });

      // The two typeaheads search independently.
      test(`scopes results to each typeahead`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.city.type('pra');
        const labels = await engine().parts.city.getResultLabels();
        assertTrue(labels.includes('Prague'));
        assertFalse(labels.includes('Paris'));
      });
    });
  },
};
