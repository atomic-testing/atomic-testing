import { FlatTreeDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { flatTreeUIExample } from './FlatTree.examples';

export const flatTreeExampleScenePart = {
  flatTreeA: { locator: byDataTestId('flat-tree-a'), driver: FlatTreeDriver },
  flatTreeB: { locator: byDataTestId('flat-tree-b'), driver: FlatTreeDriver },
  flatTreeC: { locator: byDataTestId('flat-tree-c'), driver: FlatTreeDriver },
} satisfies ScenePart;

export const flatTreeExample: IExampleUnit<typeof flatTreeExampleScenePart, JSX.Element> = {
  ...flatTreeUIExample,
  scene: flatTreeExampleScenePart,
};

export const flatTreeExampleTestSuite: TestSuiteInfo<typeof flatTreeExample.scene> = {
  title: 'Fluent FlatTree',
  url: '/flat-tree',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${flatTreeExample.title}`, () => {
      const engine = useTestEngine(flatTreeExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts every VISIBLE item across all levels (disambiguation), not just top-level', async () => {
        // flat-tree-a visible: Fruits, Apple, Citrus, Vegetables = 4 — Citrus is collapsed by default,
        // so its Orange/Lemon children are absent from the DOM entirely (see class doc).
        assertEqual(await engine().parts.flatTreeA.getItemCount(), 4);
        // flat-tree-b visible: Documents, Photos = 2 — fully collapsed by default.
        assertEqual(await engine().parts.flatTreeB.getItemCount(), 2);
        // flat-tree-c visible: Introduction, Topic, Detail, Detail(summary) = 4 — Topic is open by default.
        assertEqual(await engine().parts.flatTreeC.getItemCount(), 4);
      });

      test('getItemByIndex reads items in flat DOM order; out-of-range is null', async () => {
        const fruits = await engine().parts.flatTreeA.getItemByIndex(0);
        const apple = await engine().parts.flatTreeA.getItemByIndex(1);
        const citrus = await engine().parts.flatTreeA.getItemByIndex(2);
        assertEqual(await fruits!.getLabel(), 'Fruits');
        assertEqual(await apple!.getLabel(), 'Apple');
        assertEqual(await citrus!.getLabel(), 'Citrus');
        assertEqual(await engine().parts.flatTreeA.getItemByIndex(99), null);
      });

      test('getItemByValue finds an item by its Fluent-stamped value at any level; absent value is null', async () => {
        const citrus = await engine().parts.flatTreeA.getItemByValue('citrus');
        assertEqual(await citrus!.getLabel(), 'Citrus');
        assertEqual(await citrus!.getValue(), 'citrus');
        assertEqual(await engine().parts.flatTreeA.getItemByValue('does-not-exist'), null);
      });

      test('getItemByValue matches by value, not incidentally by label, when two items share a visible label', async () => {
        // `detail` (level 2, child of `topic`) and `summary` (level 1) share the label
        // "Detail" — see FlatTree.examples.tsx. `detail` comes first in DOM order, so
        // the inherited getItemByLabel('Detail') would resolve to `detail`; asking for
        // `summary` by value must still return `summary`, proving the two lookups are
        // not interchangeable.
        const byLabel = await engine().parts.flatTreeC.getItemByLabel('Detail');
        assertEqual(await byLabel!.getValue(), 'detail');

        const summary = await engine().parts.flatTreeC.getItemByValue('summary');
        assertEqual(await summary!.getLabel(), 'Detail');
        assertEqual(await summary!.getLevel(), 1);

        const detail = await engine().parts.flatTreeC.getItemByValue('detail');
        assertEqual(await detail!.getLabel(), 'Detail');
        assertEqual(await detail!.getLevel(), 2);
      });

      test('getLevel/getPosInSet/getSetSize read the required flat-item ARIA triad', async () => {
        const fruits = await engine().parts.flatTreeA.getItemByValue('fruits');
        const vegetables = await engine().parts.flatTreeA.getItemByValue('vegetables');
        const citrus = await engine().parts.flatTreeA.getItemByValue('citrus');

        // Top level: Fruits (1st of 2), Vegetables (2nd of 2).
        assertEqual(await fruits!.getLevel(), 1);
        assertEqual(await fruits!.getPosInSet(), 1);
        assertEqual(await fruits!.getSetSize(), 2);
        assertEqual(await vegetables!.getPosInSet(), 2);
        assertEqual(await vegetables!.getSetSize(), 2);

        // Citrus nests one level under Fruits, 2nd of Fruits's 2 children (Apple, Citrus).
        assertEqual(await citrus!.getLevel(), 2);
        assertEqual(await citrus!.getPosInSet(), 2);
        assertEqual(await citrus!.getSetSize(), 2);
      });

      test('isBranch/isLeaf distinguish expandable items from plain leaves', async () => {
        const fruits = await engine().parts.flatTreeA.getItemByValue('fruits');
        const apple = await engine().parts.flatTreeA.getItemByValue('apple');
        assertTrue(await fruits!.isBranch());
        assertFalse(await fruits!.isLeaf());
        assertFalse(await apple!.isBranch());
        assertTrue(await apple!.isLeaf());
      });

      test('a collapsed branch’s descendants are absent from the flat list until expand()ed', async () => {
        assertEqual(await engine().parts.flatTreeA.getItemByValue('orange'), null);
        assertEqual(await engine().parts.flatTreeA.getItemByValue('lemon'), null);

        const citrus = await engine().parts.flatTreeA.getItemByValue('citrus');
        assertFalse(await citrus!.isExpanded());
        await citrus!.expand();
        assertTrue(await citrus!.isExpanded());

        const orange = await engine().parts.flatTreeA.getItemByValue('orange');
        const lemon = await engine().parts.flatTreeA.getItemByValue('lemon');
        assertEqual(await orange!.getLabel(), 'Orange');
        assertEqual(await lemon!.getLabel(), 'Lemon');
        assertEqual(await engine().parts.flatTreeA.getItemCount(), 6);

        await citrus!.collapse();
        assertFalse(await citrus!.isExpanded());
        assertEqual(await engine().parts.flatTreeA.getItemByValue('orange'), null);
      });

      test('expand()/collapse() no-op on a leaf item (nothing to toggle)', async () => {
        const vegetables = await engine().parts.flatTreeA.getItemByValue('vegetables');
        assertFalse(await vegetables!.isExpanded());
        await vegetables!.expand();
        assertFalse(await vegetables!.isExpanded());
      });

      test('click() completes without error on a leaf item', async () => {
        const photos = await engine().parts.flatTreeB.getItemByValue('photos');
        await photos!.click();
      });

      test('isMultiSelect reads aria-multiselectable per instance', async () => {
        assertFalse(await engine().parts.flatTreeA.isMultiSelect());
        assertTrue(await engine().parts.flatTreeB.isMultiSelect());
        assertFalse(await engine().parts.flatTreeC.isMultiSelect());
      });

      test('single-select: selecting one item leaves siblings unselected, and rejects direct deselection', async () => {
        const apple = await engine().parts.flatTreeA.getItemByValue('apple');
        const vegetables = await engine().parts.flatTreeA.getItemByValue('vegetables');

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
        const citrus = await engine().parts.flatTreeA.getItemByValue('citrus');
        assertFalse(await citrus!.isExpanded());

        await citrus!.select();
        assertTrue(await citrus!.isSelected());
        assertFalse(await citrus!.isExpanded());
      });

      test('multiselect: two items can be selected independently, and deselection is allowed', async () => {
        const documents = await engine().parts.flatTreeB.getItemByValue('documents');
        const photos = await engine().parts.flatTreeB.getItemByValue('photos');

        await documents!.select();
        await photos!.select();
        assertTrue(await documents!.isSelected());
        assertTrue(await photos!.isSelected());

        await photos!.setSelected(false);
        assertFalse(await photos!.isSelected());
        assertTrue(await documents!.isSelected());
      });

      test('selectionMode "none" reports every item as unselected', async () => {
        const intro = await engine().parts.flatTreeC.getItemByValue('intro');
        const topic = await engine().parts.flatTreeC.getItemByValue('topic');
        assertFalse(await intro!.isSelected());
        assertFalse(await topic!.isSelected());
      });

      test('a branch already open by default (defaultOpenItems) exposes its children without an explicit expand()', async () => {
        const topic = await engine().parts.flatTreeC.getItemByValue('topic');
        assertTrue(await topic!.isExpanded());
        const detail = await engine().parts.flatTreeC.getItemByValue('detail');
        assertEqual(await detail!.getLabel(), 'Detail');
        assertTrue(await detail!.isLeaf());
      });
    });
  },
};
