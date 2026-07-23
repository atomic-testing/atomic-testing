import { TabsDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const tabsScenePart = {
  tabs: {
    locator: byDataTestId('tabs'),
    driver: TabsDriver,
  },
} satisfies ScenePart;

export const tabsTestSuite: TestSuiteInfo<typeof tabsScenePart> = {
  title: 'Reka UI Tabs',
  url: '/tabs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI Tabs', () => {
      const engine = useTestEngine(tabsScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads tab labels, count and default selection', async () => {
        assertEqual(await engine().parts.tabs.getTabLabels(), ['One', 'Two', 'Three']);
        assertEqual(await engine().parts.tabs.getTabCount(), 3);
        assertEqual(await engine().parts.tabs.getSelectedIndex(), 0);
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
      });

      test('selects a tab by label and by index', async () => {
        assertTrue(await engine().parts.tabs.selectByLabel('Two'));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'Two');

        assertTrue(await engine().parts.tabs.selectByIndex(0));
        assertEqual(await engine().parts.tabs.getSelectedLabel(), 'One');
      });

      test('reports failure selecting an unknown label or out-of-range index', async () => {
        assertFalse(await engine().parts.tabs.selectByLabel('Does not exist'));
        assertFalse(await engine().parts.tabs.selectByIndex(99));
      });

      // Deliberately read-only: TabDriver.select() has no disabled guard, so
      // driving selectByIndex/selectByLabel against the disabled tab would
      // still issue a click — harmless under jsdom (userEvent.click no-ops on
      // a disabled button) but Playwright's actionability check would instead
      // wait for the button to become enabled until its own timeout. See
      // TabsDriver's class doc.
      test('reads the disabled tab without selecting it', async () => {
        assertFalse(await engine().parts.tabs.isTabDisabled(0));
        assertFalse(await engine().parts.tabs.isTabDisabled(1));
        assertTrue(await engine().parts.tabs.isTabDisabled(2));
      });

      test('reads the linked panel text via aria-controls, tracking selection', async () => {
        assertEqual(await engine().parts.tabs.getPanelText(0), 'First panel');

        await engine().parts.tabs.selectByIndex(1);
        assertEqual(await engine().parts.tabs.getPanelText(1), 'Second panel');
      });
    });
  },
};
