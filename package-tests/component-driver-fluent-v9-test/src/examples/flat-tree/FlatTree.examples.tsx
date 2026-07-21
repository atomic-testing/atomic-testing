import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FlatTree,
  FlatTreeItem,
  FluentProvider,
  HeadlessFlatTreeItem,
  HeadlessFlatTreeItemProps,
  TreeItemLayout,
  useHeadlessFlatTree_unstable,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Three `FlatTree`s, mirroring the `Tree` example's three `selectionMode`
 * coverage (`single`, `multiselect`, unset/`"none"`) and item shapes
 * (`flat-tree-a`'s `fruits` > `citrus` > `orange`/`lemon` three-level nest,
 * `flat-tree-b`'s two-level `documents` group, `flat-tree-c`'s no-selection
 * outline) — same deliberately-different item counts/labels per instance so
 * a too-broadly-scoped locator would be caught immediately (see `Tree.examples.tsx`).
 *
 * Built on `useHeadlessFlatTree_unstable`, the pattern Fluent's own docs
 * recommend over hand-assembling `aria-level`/`aria-posinset`/`aria-setsize`
 * (`FlatTreeItem` warns in dev mode if those are missing — see
 * `FlatTreeItemDriver`'s class doc). Each item list is a flat array with
 * `parentValue` linking a child to its parent (parents must precede their
 * children — `createHeadlessTree`'s own requirement); `flatTree.items()`
 * yields only the currently VISIBLE items, so collapsing `citrus` removes
 * `orange`/`lemon` from the DOM entirely rather than merely hiding them —
 * confirmed by DOM audit (jsdom render).
 *
 * **Unlike the nested `Tree` example, no `useState` plumbing is needed for
 * `checkedItems`.** Source audit of `useFlatControllableCheckedItems`:
 * `useHeadlessFlatTree_unstable`'s options accept a genuine
 * `defaultCheckedItems` with real uncontrolled `useControllableState`
 * fallback — a capability that exists ONLY on this headless-hook options
 * object, not on the bare `<Tree checkedItems>` prop `TreeItemDriver`'s
 * class doc documents as controlled-only. `flatTree.getTreeProps()` already
 * returns a working `checkedItems`/`onCheckedChange` pair, so spreading it
 * onto `<FlatTree>` is sufficient.
 */
const flatTreeALabels: Record<string, string> = {
  fruits: 'Fruits',
  apple: 'Apple',
  citrus: 'Citrus',
  orange: 'Orange',
  lemon: 'Lemon',
  vegetables: 'Vegetables',
};

const flatTreeAItems: HeadlessFlatTreeItemProps[] = [
  { value: 'fruits', itemType: 'branch' },
  { value: 'apple', parentValue: 'fruits', itemType: 'leaf' },
  { value: 'citrus', parentValue: 'fruits', itemType: 'branch' },
  { value: 'orange', parentValue: 'citrus', itemType: 'leaf' },
  { value: 'lemon', parentValue: 'citrus', itemType: 'leaf' },
  { value: 'vegetables', itemType: 'leaf' },
];

const flatTreeBLabels: Record<string, string> = {
  documents: 'Documents',
  resume: 'Resume',
  'cover-letter': 'Cover Letter',
  photos: 'Photos',
};

const flatTreeBItems: HeadlessFlatTreeItemProps[] = [
  { value: 'documents', itemType: 'branch' },
  { value: 'resume', parentValue: 'documents', itemType: 'leaf' },
  { value: 'cover-letter', parentValue: 'documents', itemType: 'leaf' },
  { value: 'photos', itemType: 'leaf' },
];

const flatTreeCLabels: Record<string, string> = {
  intro: 'Introduction',
  topic: 'Topic',
  detail: 'Detail',
  summary: 'Summary',
};

const flatTreeCItems: HeadlessFlatTreeItemProps[] = [
  { value: 'intro', itemType: 'leaf' },
  { value: 'topic', itemType: 'branch' },
  { value: 'detail', parentValue: 'topic', itemType: 'leaf' },
  { value: 'summary', itemType: 'leaf' },
];

function renderFlatTreeItems(
  items: IterableIterator<HeadlessFlatTreeItem<HeadlessFlatTreeItemProps>>,
  labels: Record<string, string>
): JSX.Element[] {
  return Array.from(items, flatTreeItem => {
    const { children, ...treeItemProps } = flatTreeItem.getTreeItemProps();
    return (
      <FlatTreeItem {...treeItemProps} key={treeItemProps.value}>
        <TreeItemLayout>{labels[String(treeItemProps.value)]}</TreeItemLayout>
      </FlatTreeItem>
    );
  });
}

const FlatTreeExample = () => {
  const flatTreeA = useHeadlessFlatTree_unstable(flatTreeAItems, {
    selectionMode: 'single',
    defaultOpenItems: ['fruits'],
  });
  const flatTreeB = useHeadlessFlatTree_unstable(flatTreeBItems, { selectionMode: 'multiselect' });
  const flatTreeC = useHeadlessFlatTree_unstable(flatTreeCItems, { defaultOpenItems: ['topic'] });

  return (
    <FluentProvider theme={webLightTheme}>
      <FlatTree {...flatTreeA.getTreeProps()} aria-label='Groceries' data-testid='flat-tree-a'>
        {renderFlatTreeItems(flatTreeA.items(), flatTreeALabels)}
      </FlatTree>

      <FlatTree {...flatTreeB.getTreeProps()} aria-label='Files' data-testid='flat-tree-b'>
        {renderFlatTreeItems(flatTreeB.items(), flatTreeBLabels)}
      </FlatTree>

      <FlatTree {...flatTreeC.getTreeProps()} aria-label='Unselectable outline' data-testid='flat-tree-c'>
        {renderFlatTreeItems(flatTreeC.items(), flatTreeCLabels)}
      </FlatTree>
    </FluentProvider>
  );
};

export const flatTreeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent FlatTree',
  ui: <FlatTreeExample />,
};
