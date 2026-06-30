import { PowerSearchDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { powerSearchUIExample } from './PowerSearch.examples';

export const powerSearchExampleScenePart = {
  search: {
    locator: byDataTestId('search'),
    driver: PowerSearchDriver,
  },
  empty: {
    locator: byDataTestId('empty-search'),
    driver: PowerSearchDriver,
  },
} satisfies ScenePart;

export const powerSearchExample: IExampleUnit<typeof powerSearchExampleScenePart, JSX.Element> = {
  ...powerSearchUIExample,
  scene: powerSearchExampleScenePart,
};

export const powerSearchExampleTestSuite: TestSuiteInfo<typeof powerSearchExample.scene> = {
  title: 'Astryx PowerSearch',
  url: '/power-search',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${powerSearchExample.title}`, () => {
      const engine = useTestEngine(powerSearchExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // Chip enumeration + result count read without any interaction; the two bars stay independent.
      test(`reads filter chips and result count`, async () => {
        assertEqual(await engine().parts.search.getFilterLabels(), ['Status: is', 'Priority: is']);
        assertEqual(await engine().parts.search.getFilterCount(), 2);
        assertEqual(await engine().parts.search.getResultCount(), 42);
        assertEqual(await engine().parts.empty.getFilterCount(), 0);
        assertEqual(await engine().parts.empty.getResultCount(), 0);
      });

      // removeFilter drops a chip by its field/operator label; unknown labels return false.
      test(`removeFilter removes a chip`, async () => {
        assertFalse(await engine().parts.search.removeFilter('Nope'));
        assertTrue(await engine().parts.search.removeFilter('Status: is'));
        assertEqual(await engine().parts.search.getFilterLabels(), ['Priority: is']);
      });

      // clearAll removes every chip.
      test(`clearAll empties the bar`, async () => {
        assertTrue(await engine().parts.search.clearAll());
        assertEqual(await engine().parts.search.getFilterCount(), 0);
      });

      // Typing the query lists matching field suggestions. (native-popover → not WebKit)
      test(`query lists field suggestions`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.search.type('titl');
        assertTrue((await engine().parts.search.getFieldSuggestionLabels()).some(l => l.includes('Title')));
      });

      // editFilter opens the chip's edit popover (best-effort v1: reading the popover is E2E/follow-up).
      test(`editFilter targets a chip`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.search.editFilter('Nope'));
        assertTrue(await engine().parts.search.editFilter('Priority: is'));
      });
    });
  },
};
