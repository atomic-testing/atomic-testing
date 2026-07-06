import { SimpleTreeViewDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicSimpleTreeViewUIExample } from './SimpleTreeView.examples';

export const simpleTreeViewExampleScenePart = {
  tree: {
    locator: byDataTestId('basic-tree-view'),
    driver: SimpleTreeViewDriver,
  },
} satisfies ScenePart;

export const simpleTreeViewExample: IExampleUnit<typeof simpleTreeViewExampleScenePart, JSX.Element> = {
  ...basicSimpleTreeViewUIExample,
  scene: simpleTreeViewExampleScenePart,
};

export const simpleTreeViewTestSuite: TestSuiteInfo<typeof simpleTreeViewExampleScenePart> = {
  title: 'SimpleTreeView',
  url: '/treeview',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(simpleTreeViewExample.scene, getTestEngine, { beforeEach, afterEach });

    test('only top-level items are rendered initially (collapsed branches absent)', async () => {
      assertEqual(await engine().parts.tree.getItemCount(), 2);
      assertEqual(await engine().parts.tree.getItemIds(), ['fruits', 'vegetables']);
    });

    test('getItemLabel returns a specific item label', async () => {
      assertEqual(await engine().parts.tree.getItemLabel('vegetables'), 'Vegetables');
    });

    test('a collapsed parent reports not expanded and hides its children', async () => {
      assertFalse(await engine().parts.tree.isExpanded('fruits'));
      assertFalse(await engine().parts.tree.itemExists('apple'));
    });

    test('expandItem reveals children and flips aria-expanded', async () => {
      await engine().parts.tree.expandItem('fruits');
      assertTrue(await engine().parts.tree.isExpanded('fruits'));
      assertTrue(await engine().parts.tree.itemExists('apple'));
      assertEqual(await engine().parts.tree.getItemCount(), 4);
    });

    test('collapseItem flips aria-expanded back to collapsed', async () => {
      await engine().parts.tree.expandItem('fruits');
      await engine().parts.tree.collapseItem('fruits');
      // aria-expanded is the authoritative collapsed signal. Child <li>s linger in the DOM
      // until MUI's Collapse transition finishes (which never runs under jsdom), so asserting
      // their removal would be environment-dependent.
      assertFalse(await engine().parts.tree.isExpanded('fruits'));
    });

    test('selectItem selects a leaf and flips its selection state', async () => {
      await engine().parts.tree.expandItem('fruits');
      assertFalse(await engine().parts.tree.isSelected('apple'));
      await engine().parts.tree.selectItem('apple');
      assertTrue(await engine().parts.tree.isSelected('apple'));
      // Selection is single by default, so a sibling stays unselected.
      assertFalse(await engine().parts.tree.isSelected('banana'));
    });
  },
};
