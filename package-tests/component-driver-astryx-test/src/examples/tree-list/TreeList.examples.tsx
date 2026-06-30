import { TreeList } from '@astryxdesign/core/TreeList';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

const noop = () => {};

/**
 * Astryx TreeList scene.
 *
 * TreeList self-emits `data-testid` on the root `<div>`; inside is a
 * `<ul role="tree">` of `<li role="treeitem">` rows whose children nest in
 * `<ul role="group">`. Row state is ARIA on the `<li>` (`aria-expanded`,
 * `aria-selected`). `src` is seeded expanded and `docs` collapsed, so the visible
 * set (and expand/collapse) can be exercised; a second tree verifies scoping.
 */
export const TreeListExample = () => (
  <>
    <TreeList
      data-testid='files'
      items={[
        {
          id: 'src',
          label: 'src',
          isExpanded: true,
          onClick: noop,
          children: [
            { id: 'app', label: 'App.tsx', onClick: noop },
            { id: 'index', label: 'index.tsx', isSelected: true, onClick: noop },
          ],
        },
        {
          id: 'docs',
          label: 'docs',
          onClick: noop,
          children: [{ id: 'readme', label: 'README.md', onClick: noop }],
        },
        { id: 'pkg', label: 'package.json', onClick: noop },
      ]}
    />
    <TreeList
      data-testid='menu'
      items={[
        { id: 'file', label: 'File', onClick: noop },
        { id: 'edit', label: 'Edit', onClick: noop },
      ]}
    />
  </>
);

export const treeListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TreeList',
  ui: <TreeListExample />,
};
