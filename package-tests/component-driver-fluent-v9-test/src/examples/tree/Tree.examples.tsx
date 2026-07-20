import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  Tree,
  TreeCheckedChangeData,
  TreeCheckedChangeEvent,
  TreeItem,
  TreeItemLayout,
  TreeItemValue,
  TreeSelectionValue,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * Three `Tree`s exercising the three `selectionMode` values Fluent supports
 * (`single`, `multiselect`, and the default `none`) with deliberately
 * different item counts/labels so a too-broadly-scoped locator in
 * `TreeDriver`/`TreeItemDriver` would be caught immediately (same
 * disambiguation shape as the `Nav`/`Accordion` examples). Every `TreeItem`
 * sets an explicit `value` so `TreeItemDriver.getValue()` has something
 * meaningful to read back (see its class doc — Fluent falls back to an
 * unstable generated id when `value` is omitted). `TreeItem` has no
 * `disabled` prop at all (DOM audit, @fluentui/react-tree@9.16.3 — grepped
 * the compiled type declarations: absent from `TreeItemProps`), so unlike
 * the `Accordion` example this fixture has no disabled item to exercise.
 *
 * **`checkedItems`/`onCheckedChange` are REQUIRED for selection to do
 * anything at all** — DOM audit of `@fluentui/react-tree@9.16.3`'s
 * `useTree`/`useNestedControllableCheckedItems` source: unlike `openItems`
 * (which has a real uncontrolled fallback via `useControllableOpenItems`),
 * `checkedItems` is derived ONLY from the `checkedItems` prop
 * (`useMemo(() => createCheckedItems(props.checkedItems), [props.checkedItems])`)
 * with no internal state and no `defaultCheckedItems` on the base `<Tree>`
 * (`defaultCheckedItems` exists only on the separate, out-of-scope
 * `HeadlessFlatTreeOptions`/`FlatTree` API) — a bare
 * `<Tree selectionMode="single">` with no `checkedItems` wired is *silently*
 * unselectable no matter what's clicked or key-pressed, confirmed by
 * instrumenting a real render and watching `onCheckedChange` never fire.
 * `tree-a`/`tree-b` therefore lift `checkedItems` into local state.
 *
 * `tree-a` (single-select) nests three levels deep (`fruits` > `citrus` >
 * `orange`/`lemon`) with `fruits` open by default but `citrus` collapsed —
 * covering both "children already reachable" and "children need an explicit
 * expand()" in the same tree. `tree-b` (multiselect) starts fully collapsed.
 * `tree-c` (default, `selectionMode` unset — `"none"`) has no selection UI
 * at all, covering the "no selector renders" case — and needs no controlled
 * state, since `requestCheckedChange` itself no-ops when `selectionMode` is
 * `"none"`.
 */
const TreeExample = () => {
  const [singleChecked, setSingleChecked] = useState<Map<TreeItemValue, TreeSelectionValue>>(new Map());
  const [multiChecked, setMultiChecked] = useState<Map<TreeItemValue, TreeSelectionValue>>(new Map());

  const onSingleCheckedChange = (_event: TreeCheckedChangeEvent, data: TreeCheckedChangeData) => {
    setSingleChecked(new Map(data.checkedItems));
  };
  const onMultiCheckedChange = (_event: TreeCheckedChangeEvent, data: TreeCheckedChangeData) => {
    setMultiChecked(new Map(data.checkedItems));
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <Tree
        aria-label='Groceries'
        data-testid='tree-a'
        selectionMode='single'
        defaultOpenItems={['fruits']}
        checkedItems={singleChecked}
        onCheckedChange={onSingleCheckedChange}>
        <TreeItem itemType='branch' value='fruits'>
          <TreeItemLayout>Fruits</TreeItemLayout>
          <Tree>
            <TreeItem itemType='leaf' value='apple'>
              <TreeItemLayout>Apple</TreeItemLayout>
            </TreeItem>
            <TreeItem itemType='branch' value='citrus'>
              <TreeItemLayout>Citrus</TreeItemLayout>
              <Tree>
                <TreeItem itemType='leaf' value='orange'>
                  <TreeItemLayout>Orange</TreeItemLayout>
                </TreeItem>
                <TreeItem itemType='leaf' value='lemon'>
                  <TreeItemLayout>Lemon</TreeItemLayout>
                </TreeItem>
              </Tree>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem itemType='leaf' value='vegetables'>
          <TreeItemLayout>Vegetables</TreeItemLayout>
        </TreeItem>
      </Tree>

      <Tree
        aria-label='Files'
        data-testid='tree-b'
        selectionMode='multiselect'
        checkedItems={multiChecked}
        onCheckedChange={onMultiCheckedChange}>
        <TreeItem itemType='branch' value='documents'>
          <TreeItemLayout>Documents</TreeItemLayout>
          <Tree>
            <TreeItem itemType='leaf' value='resume'>
              <TreeItemLayout>Resume</TreeItemLayout>
            </TreeItem>
            <TreeItem itemType='leaf' value='cover-letter'>
              <TreeItemLayout>Cover Letter</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem itemType='leaf' value='photos'>
          <TreeItemLayout>Photos</TreeItemLayout>
        </TreeItem>
      </Tree>

      <Tree aria-label='Unselectable outline' data-testid='tree-c' defaultOpenItems={['topic']}>
        <TreeItem itemType='leaf' value='intro'>
          <TreeItemLayout>Introduction</TreeItemLayout>
        </TreeItem>
        <TreeItem itemType='branch' value='topic'>
          <TreeItemLayout>Topic</TreeItemLayout>
          <Tree>
            <TreeItem itemType='leaf' value='detail'>
              <TreeItemLayout>Detail</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem itemType='leaf' value='summary'>
          <TreeItemLayout>Summary</TreeItemLayout>
        </TreeItem>
      </Tree>
    </FluentProvider>
  );
};

export const treeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Tree',
  ui: <TreeExample />,
};
