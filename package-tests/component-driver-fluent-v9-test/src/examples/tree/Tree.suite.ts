import { TreeDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { treeUIExample } from './Tree.examples';

export const treeExampleScenePart = {
  treeA: { locator: byDataTestId('tree-a'), driver: TreeDriver },
  treeB: { locator: byDataTestId('tree-b'), driver: TreeDriver },
  treeC: { locator: byDataTestId('tree-c'), driver: TreeDriver },
} satisfies ScenePart;

export const treeExample: IExampleUnit<typeof treeExampleScenePart, JSX.Element> = {
  ...treeUIExample,
  scene: treeExampleScenePart,
};

export const treeExampleTestSuite: TestSuiteInfo<typeof treeExample.scene> = {
  title: 'Fluent Tree',
  url: '/tree',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${treeExample.title}`, () => {
      const engine = useTestEngine(treeExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts top-level items per instance (disambiguation), NOT flattened across nesting', async () => {
        // tree-a top level: Fruits (branch), Vegetables (leaf) = 2 — Citrus/Orange/Lemon nest under Fruits.
        assertEqual(await engine().parts.treeA.getItemCount(), 2);
        // tree-b top level: Documents (branch), Photos (leaf) = 2.
        assertEqual(await engine().parts.treeB.getItemCount(), 2);
        // tree-c top level: Introduction, Topic (branch), Summary = 3.
        assertEqual(await engine().parts.treeC.getItemCount(), 3);
      });

      test('getItemByIndex reads top-level labels in DOM order; out-of-range is null', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        const vegetables = await engine().parts.treeA.getItemByIndex(1);
        assertEqual(await fruits!.getLabel(), 'Fruits');
        assertEqual(await vegetables!.getLabel(), 'Vegetables');
        assertEqual(await engine().parts.treeA.getItemByIndex(99), null);
      });

      test('getLabel reads only this item’s own text, not an expanded descendant’s (over-inclusion hazard)', async () => {
        // Fruits is open by default (defaultOpenItems), so its subtree is mounted —
        // getLabel() must still read "Fruits" alone, not "FruitsAppleCitrus...".
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        assertEqual(await fruits!.getLabel(), 'Fruits');
      });

      test('isBranch/isLeaf distinguish expandable items from plain leaves', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        const vegetables = await engine().parts.treeA.getItemByIndex(1);
        assertTrue(await fruits!.isBranch());
        assertFalse(await fruits!.isLeaf());
        assertFalse(await vegetables!.isBranch());
        assertTrue(await vegetables!.isLeaf());
      });

      test('getValue reads the DOM-reflected data-fui-tree-item-value', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        assertEqual(await fruits!.getValue(), 'fruits');
      });

      test('reads default expansion state: Fruits open, its nested Citrus collapsed', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        assertTrue(await fruits!.isExpanded());

        const citrus = await fruits!.getChildItemByIndex(1);
        assertEqual(await citrus!.getLabel(), 'Citrus');
        assertFalse(await citrus!.isExpanded());
      });

      test('a collapsed branch reports zero children until expand()ed, then real children after', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        const citrus = await fruits!.getChildItemByIndex(1);

        // Collapsed: Orange/Lemon are unmounted, not merely hidden.
        assertEqual(await citrus!.getChildItemCount(), 0);
        assertEqual(await citrus!.getChildItems(), []);

        await citrus!.expand();
        assertTrue(await citrus!.isExpanded());
        assertEqual(await citrus!.getChildItemCount(), 2);
        const grandchildren = await citrus!.getChildItems();
        assertEqual(await grandchildren[0]!.getLabel(), 'Orange');
        assertEqual(await grandchildren[1]!.getLabel(), 'Lemon');

        await citrus!.collapse();
        assertFalse(await citrus!.isExpanded());
        assertEqual(await citrus!.getChildItemCount(), 0);
      });

      test('expand()/collapse() no-op on a leaf item (nothing to toggle)', async () => {
        const vegetables = await engine().parts.treeA.getItemByIndex(1);
        assertFalse(await vegetables!.isExpanded());
        await vegetables!.expand();
        assertFalse(await vegetables!.isExpanded());
      });

      test('click() completes without error on a leaf item', async () => {
        const photos = await engine().parts.treeB.getItemByIndex(1);
        await photos!.click();
      });

      test('isMultiSelect reads aria-multiselectable per instance', async () => {
        assertFalse(await engine().parts.treeA.isMultiSelect());
        assertTrue(await engine().parts.treeB.isMultiSelect());
        assertFalse(await engine().parts.treeC.isMultiSelect());
      });

      test('single-select: selecting one item leaves siblings unselected, and rejects direct deselection', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        const apple = await fruits!.getChildItemByIndex(0);
        const vegetables = await engine().parts.treeA.getItemByIndex(1);

        assertFalse(await apple!.isSelected());
        await apple!.select();
        assertTrue(await apple!.isSelected());
        assertFalse(await vegetables!.isSelected());

        let rejected = false;
        try {
          await apple!.setSelected(false);
        } catch {
          rejected = true;
        }
        assertTrue(rejected);
      });

      test('selecting a collapsed branch does not also expand it', async () => {
        const fruits = await engine().parts.treeA.getItemByIndex(0);
        const citrus = await fruits!.getChildItemByIndex(1);
        assertFalse(await citrus!.isExpanded());

        await citrus!.select();
        assertTrue(await citrus!.isSelected());
        assertFalse(await citrus!.isExpanded());
      });

      test('multiselect: two items can be selected independently, and deselection is allowed', async () => {
        const documents = await engine().parts.treeB.getItemByIndex(0);
        const photos = await engine().parts.treeB.getItemByIndex(1);

        await documents!.select();
        await photos!.select();
        assertTrue(await documents!.isSelected());
        assertTrue(await photos!.isSelected());

        await photos!.setSelected(false);
        assertFalse(await photos!.isSelected());
        assertTrue(await documents!.isSelected());
      });

      test('selectionMode "none" reports every item as unselected', async () => {
        const intro = await engine().parts.treeC.getItemByIndex(0);
        const topic = await engine().parts.treeC.getItemByIndex(1);
        assertFalse(await intro!.isSelected());
        assertFalse(await topic!.isSelected());
      });

      test('a branch already open by default (defaultOpenItems) exposes its children without an explicit expand()', async () => {
        const topic = await engine().parts.treeC.getItemByIndex(1);
        assertTrue(await topic!.isExpanded());
        assertEqual(await topic!.getChildItemCount(), 1);
        const detail = await topic!.getChildItemByIndex(0);
        assertEqual(await detail!.getLabel(), 'Detail');
        assertTrue(await detail!.isLeaf());
      });
    });
  },
};
