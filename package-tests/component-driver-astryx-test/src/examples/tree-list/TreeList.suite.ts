import { TreeListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { treeListUIExample } from './TreeList.examples';

export const treeListExampleScenePart = {
  files: {
    locator: byDataTestId('files'),
    driver: TreeListDriver,
  },
  menu: {
    locator: byDataTestId('menu'),
    driver: TreeListDriver,
  },
} satisfies ScenePart;

export const treeListExample: IExampleUnit<typeof treeListExampleScenePart, JSX.Element> = {
  ...treeListUIExample,
  scene: treeListExampleScenePart,
};

export const treeListExampleTestSuite: TestSuiteInfo<typeof treeListExample.scene> = {
  title: 'Astryx TreeList',
  url: '/tree-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${treeListExample.title}`, () => {
      const engine = useTestEngine(treeListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getVisibleItemLabels reflects expansion: src is expanded, docs collapsed (README.md hidden).
      test(`lists only visible rows in depth-first order`, async () => {
        assertEqual(await engine().parts.files.getVisibleItemLabels(), [
          'src',
          'App.tsx',
          'index.tsx',
          'docs',
          'package.json',
        ]);
        assertEqual(await engine().parts.files.getItemCount(), 5);
        assertEqual(await engine().parts.menu.getVisibleItemLabels(), ['File', 'Edit']);
      });

      // Expanded/selected state comes from ARIA on the <li>; depth from the walk.
      test(`reads expanded, selected, and depth state`, async () => {
        assertTrue(await engine().parts.files.isItemExpanded('src'));
        assertFalse(await engine().parts.files.isItemExpanded('docs'));
        assertFalse(await engine().parts.files.isItemExpanded('App.tsx'));
        assertTrue(await engine().parts.files.isItemSelected('index.tsx'));
        assertFalse(await engine().parts.files.isItemSelected('App.tsx'));
        assertEqual(await engine().parts.files.getItemDepth('src'), 0);
        assertEqual(await engine().parts.files.getItemDepth('App.tsx'), 1);
        assertEqual(await engine().parts.files.getItemDepth('package.json'), 0);
      });

      // Expanding a collapsed branch reveals its children.
      test(`expandItem reveals children`, async () => {
        assertTrue(await engine().parts.files.expandItem('docs'));
        assertTrue(await engine().parts.files.isItemExpanded('docs'));
        assertTrue((await engine().parts.files.getVisibleItemLabels()).includes('README.md'));
      });

      // Collapsing a branch hides its children.
      test(`collapseItem hides children`, async () => {
        assertTrue(await engine().parts.files.collapseItem('src'));
        assertFalse((await engine().parts.files.getVisibleItemLabels()).includes('App.tsx'));
      });

      // clickItem reports unknown labels.
      test(`clickItem reports unknown labels`, async () => {
        assertFalse(await engine().parts.files.clickItem('Nope'));
        assertTrue(await engine().parts.files.clickItem('package.json'));
      });
    });
  },
};
