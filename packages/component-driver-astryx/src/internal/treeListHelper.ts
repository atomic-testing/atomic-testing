import { byCssSelector, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

/** A located tree row plus the depth at which the recursive walk found it (root items = 0). */
export interface TreeItemRef {
  readonly li: PartLocator;
  readonly depth: number;
}

const TREE_ROOT = byCssSelector('ul[role="tree"]');
const NESTED_GROUP = byCssSelector('> ul[role="group"]');

/** The k-th (1-based) `<li>` child of a tree/group `<ul>` (every child is a `treeitem`). */
function liChildAt(ul: PartLocator, position: number): PartLocator {
  return locatorUtil.append(ul, byCssSelector(`> li:nth-child(${position})`));
}

/**
 * The row's own content wrapper — its second element child. The optional nested
 * `<ul role="group">` is the third child, so scoping label/toggle lookups here
 * excludes descendant rows' controls.
 */
export function ownRow(li: PartLocator): PartLocator {
  return locatorUtil.append(li, byCssSelector('> *:nth-child(2)'));
}

/**
 * The row's own label element, scoped to exclude nested rows. Astryx renders this
 * as a `<button>` (when the row has `onClick`), an `<a>` (when it has `href`), or a
 * `<span>` otherwise — but always with `aria-labelledby` pointing at its text
 * `<span>`, so that attribute (not the tag) is the stable anchor.
 */
export function labelElement(li: PartLocator): PartLocator {
  return locatorUtil.append(ownRow(li), byCssSelector('[aria-labelledby]'));
}

/** The row's own expand/collapse chevron (`aria-label="Toggle children"`), present only when it has children. */
export function toggleButton(li: PartLocator): PartLocator {
  return locatorUtil.append(ownRow(li), byCssSelector('button[aria-label="Toggle children"]'));
}

/**
 * Walk the tree depth-first and collect every currently-rendered `treeitem` with
 * its depth, in visible (DOM) order.
 *
 * Addressing is purely structural — `ul > li:nth-child(k)` for siblings and
 * `li > ul[role="group"]` for the nested branch — which both jsdom and Playwright
 * resolve identically and which never couples to a StyleX-hashed class. A collapsed
 * row simply has no nested `<ul role="group">`, so its descendants are absent from
 * the result, matching what a user can see.
 */
export async function collectTreeItems(interactor: Interactor, root: PartLocator): Promise<TreeItemRef[]> {
  const out: TreeItemRef[] = [];
  await walk(interactor, locatorUtil.append(root, TREE_ROOT), 0, out);
  return out;
}

async function walk(interactor: Interactor, ul: PartLocator, depth: number, out: TreeItemRef[]): Promise<void> {
  for (let position = 1; await interactor.exists(liChildAt(ul, position)); position++) {
    const li = liChildAt(ul, position);
    out.push({ li, depth });
    const group = locatorUtil.append(li, NESTED_GROUP);
    if (await interactor.exists(group)) {
      await walk(interactor, group, depth + 1, out);
    }
  }
}
