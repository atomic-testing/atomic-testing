import { SearchBoxDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { searchBoxUIExample } from './SearchBox.examples';

export const searchBoxExampleScenePart = {
  empty: { locator: byDataTestId('search-empty'), driver: SearchBoxDriver },
  filled: { locator: byDataTestId('search-filled'), driver: SearchBoxDriver },
  disabled: { locator: byDataTestId('search-disabled'), driver: SearchBoxDriver },
  noDismiss: { locator: byDataTestId('search-no-dismiss'), driver: SearchBoxDriver },
} satisfies ScenePart;

export const searchBoxExample: IExampleUnit<typeof searchBoxExampleScenePart, JSX.Element> = {
  ...searchBoxUIExample,
  scene: searchBoxExampleScenePart,
};

export const searchBoxExampleTestSuite: TestSuiteInfo<typeof searchBoxExample.scene> = {
  title: 'Fluent SearchBox',
  url: '/search',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${searchBoxExample.title}`, () => {
      const engine = useTestEngine(searchBoxExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads and writes the value per instance (native input round trip)', async () => {
        assertEqual(await engine().parts.empty.getValue(), '');
        assertEqual(await engine().parts.filled.getValue(), 'hello');

        await engine().parts.empty.setValue('atomic');
        assertEqual(await engine().parts.empty.getValue(), 'atomic');
      });

      test('clear() empties the value, disambiguated from a sibling instance', async () => {
        await engine().parts.empty.setValue('untouched');

        await engine().parts.filled.clear();

        assertEqual(await engine().parts.filled.getValue(), '');
        assertEqual(await engine().parts.empty.getValue(), 'untouched');
      });

      test('reports the dismiss button as present by default, regardless of value or disabled state', async () => {
        assertTrue(await engine().parts.empty.hasClearButton());
        assertTrue(await engine().parts.filled.hasClearButton());
        assertTrue(await engine().parts.disabled.hasClearButton());
      });

      test('reports no dismiss button when the consumer suppresses the slot (dismiss={null})', async () => {
        assertFalse(await engine().parts.noDismiss.hasClearButton());
      });

      test('reads the disabled state per instance', async () => {
        assertFalse(await engine().parts.empty.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
