import { TabsDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const tabsScenePart = {
  tabs: {
    locator: byDataTestId('demo-tabs'),
    driver: TabsDriver,
  },
} satisfies ScenePart;

export const tabsTestSuite: TestSuiteInfo<typeof tabsScenePart> = {
  title: 'PrimeVue Tabs',
  url: '/tabs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Tabs', () => {
      const engine = useTestEngine(tabsScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads tab labels, count and default selection', async () => {
        assertEqual(await engine().parts.tabs.getTabLabels(), ['One', 'Two', 'Three']);
        assertEqual(await engine().parts.tabs.getTabCount(), 3);
        assertEqual(await engine().parts.tabs.getSelectedIndex(), 0);
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
      });

      test('tab switching round-trip: select, isSelected, panel content', async () => {
        assertTrue(await engine().parts.tabs.selectByLabel('Two'));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'Two');
        const selected = await engine().parts.tabs.getItemByIndex(1);
        assertTrue(await selected?.isSelected());
        assertEqual(await engine().parts.tabs.getPanelText(1), 'Second panel');

        assertTrue(await engine().parts.tabs.selectByIndex(0));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
        assertEqual(await engine().parts.tabs.getPanelText(0), 'First panel');
      });

      test('reports failure selecting an unknown label or out-of-range index', async () => {
        assertFalse(await engine().parts.tabs.selectByLabel('Does not exist'));
        assertFalse(await engine().parts.tabs.selectByIndex(99));
      });

      // No click lands on the disabled tab: PrimeVue styles it
      // pointer-events: none, so a click would throw in jsdom (user-event's
      // pointer-events assertion) and stall Playwright's actionability wait —
      // the disabled READ is the portable contract.
      test('reads the disabled tab', async () => {
        assertFalse(await engine().parts.tabs.isTabDisabled(0));
        assertTrue(await engine().parts.tabs.isTabDisabled(2));
        assertEqual(await engine().parts.tabs.getSelectedIndex(), 0);
      });
    });
  },
};
