import { ToggleGroupDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const toggleGroupScenePart = {
  single: {
    locator: byDataTestId('toggle-group-single'),
    driver: ToggleGroupDriver,
  },
  multiple: {
    locator: byDataTestId('toggle-group-multiple'),
    driver: ToggleGroupDriver,
  },
} satisfies ScenePart;

export const toggleGroupTestSuite: TestSuiteInfo<typeof toggleGroupScenePart> = {
  title: 'Reka UI ToggleGroup',
  url: '/toggle-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI ToggleGroup', () => {
      const engine = useTestEngine(toggleGroupScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads item labels and count', async () => {
        assertEqual(await engine().parts.single.getItemLabels(), ['Left', 'Center', 'Right']);
        assertEqual(await engine().parts.single.getItemCount(), 3);
      });

      test('reads the default selection in single mode', async () => {
        assertEqual(await engine().parts.single.getSelectedLabels(), ['Left']);
      });

      test('reads the default selection in multiple mode (more than one label can be selected)', async () => {
        assertEqual(await engine().parts.multiple.getSelectedLabels(), ['Bold']);

        const italic = await engine().parts.multiple.getItemByLabel('Italic');
        assertTrue(italic != null);
        await italic!.setSelected(true);
        assertEqual(await engine().parts.multiple.getSelectedLabels(), ['Bold', 'Italic']);
      });

      test('selects an item by label', async () => {
        const center = await engine().parts.single.getItemByLabel('Center');
        assertTrue(center != null);
        await center!.setSelected(true);
        assertEqual(await engine().parts.single.getSelectedLabels(), ['Center']);
      });

      test('selects an item by index', async () => {
        const bold = await engine().parts.multiple.getItemByIndex(0);
        assertTrue(bold != null);
        assertEqual(await bold!.getText(), 'Bold');
      });

      test('reads per-item disabled state', async () => {
        const right = await engine().parts.single.getItemByLabel('Right');
        assertTrue(right != null && (await right.isDisabled()));
        const left = await engine().parts.single.getItemByLabel('Left');
        assertFalse(left != null && (await left.isDisabled()));
      });

      test('a disabled item no-ops setSelected', async () => {
        const right = await engine().parts.single.getItemByLabel('Right');
        assertTrue(right != null);
        await right!.setSelected(true);
        assertFalse(await right!.isSelected());
      });

      test('two instances on the same page stay independent', async () => {
        assertEqual(await engine().parts.single.getItemCount(), 3);
        assertEqual(await engine().parts.multiple.getItemCount(), 2);
        assertEqual(await engine().parts.single.getSelectedLabels(), ['Left']);
        assertEqual(await engine().parts.multiple.getSelectedLabels(), ['Bold']);
      });
    });
  },
};
