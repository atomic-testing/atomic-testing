import { TabsDriver } from '@atomic-testing/component-driver-angular-material-v21';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const tabsScenePart = {
  fruit: {
    locator: byDataTestId('fruit-tabs'),
    driver: TabsDriver,
  },
  color: {
    locator: byDataTestId('color-tabs'),
    driver: TabsDriver,
  },
} satisfies ScenePart;

export const tabsTestSuite: TestSuiteInfo<typeof tabsScenePart> = {
  title: 'Angular Material v21 Tabs',
  url: '/tabs',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatTabGroup', () => {
      const engine = useTestEngine(tabsScenePart, getTestEngine, { beforeEach, afterEach });

      // Each group enumerates its own role="tab" children — two groups never
      // leak each other's tabs.
      test('reports each group its own tab labels', async () => {
        assertEqual(await engine().parts.fruit.getTabLabels(), ['Apple', 'Banana', 'Cherry']);
        assertEqual(await engine().parts.color.getTabLabels(), ['Red', 'Green', 'Blue']);
      });

      test('reports the tab count', async () => {
        assertEqual(await engine().parts.fruit.getTabCount(), 3);
      });

      test('reports the selected index independently per group', async () => {
        assertEqual(await engine().parts.fruit.getSelectedIndex(), 0);
        assertEqual(await engine().parts.color.getSelectedIndex(), 2);
      });

      test('reports the selected label', async () => {
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Apple');
        assertEqual(await engine().parts.color.getSelectedLabel(), 'Blue');
      });

      test('selects a tab by index', async () => {
        assertTrue(await engine().parts.fruit.selectByIndex(1));
        assertEqual(await engine().parts.fruit.getSelectedIndex(), 1);
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
      });

      test('selects a tab by label', async () => {
        assertTrue(await engine().parts.fruit.selectByLabel('Banana'));
        assertEqual(await engine().parts.fruit.getSelectedIndex(), 1);
      });

      test('returns false for out-of-range / unknown selection', async () => {
        assertFalse(await engine().parts.fruit.selectByIndex(99));
        assertFalse(await engine().parts.fruit.selectByLabel('Durian'));
      });

      test('reports disabled tabs per group', async () => {
        assertTrue(await engine().parts.fruit.isTabDisabled(2));
        assertFalse(await engine().parts.fruit.isTabDisabled(0));
        assertFalse(await engine().parts.color.isTabDisabled(2));
      });

      test('exposes per-tab item drivers', async () => {
        const apple = await engine().parts.fruit.getItemByLabel('Apple');
        assertTrue(apple != null);
        assertTrue(await apple!.isSelected());

        const banana = await engine().parts.fruit.getItemByIndex(1);
        assertTrue(banana != null);
        assertFalse(await banana!.isSelected());

        const cherry = await engine().parts.fruit.getItemByIndex(2);
        assertTrue(await cherry!.isDisabled());
      });

      // The panel is resolved through the selected tab's aria-controls →
      // tabpanel id link.
      test('reads the selected tab panel text', async () => {
        assertEqual(await engine().parts.fruit.getSelectedTabPanelText(), 'Apple content');
        assertEqual(await engine().parts.color.getSelectedTabPanelText(), 'Blue content');
      });

      test('reads the panel text of a newly selected tab', async () => {
        assertTrue(await engine().parts.fruit.selectByLabel('Banana'));
        // The new panel's content attaches while the tab transition settles;
        // probe rather than assert immediately.
        const panelText = await engine().parts.fruit.waitUntil({
          probeFn: () => engine().parts.fruit.getSelectedTabPanelText(),
          terminateCondition: 'Banana content',
          timeoutMs: 5000,
        });
        assertEqual(panelText, 'Banana content');
      });
    });
  },
};
