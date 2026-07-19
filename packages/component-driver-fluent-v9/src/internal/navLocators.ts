import { childListHelper, ComponentDriver, Interactor, PartLocator } from '@atomic-testing/core';

import { NavCategoryItemDriver } from '../components/NavCategoryItemDriver';
import { NavItemDriver } from '../components/NavItemDriver';

/**
 * Shared item-enumeration logic for `NavDriver` and `NavDrawerDriver` — both
 * contain the identical `NavItem`/`NavCategory`/`NavCategoryItem`/`NavSubItem`
 * tree shape (`NavDrawer` differs only in WHERE its root mounts, see
 * `NavDrawerDriver`'s portal re-root doc), so this module is the single
 * place that walk lives, rather than duplicating it across both driver
 * classes.
 *
 * `groupSelector: '*'` recurses through any non-matching wrapper — needed
 * because `NavCategory`'s own wrapper `<div>` (grouping `NavCategoryItem` +
 * `NavSubItemGroup`) carries no class this selector matches, so the walk
 * must descend through it (and, one level deeper, through
 * `NavSubItemGroup`) to reach nested items — see `childListHelper`'s own doc
 * for the recursion contract.
 */
const navItemSelector = ':is(.fui-NavItem, .fui-NavCategoryItem, .fui-NavSubItem)';
const navCategoryItemSelector = '.fui-NavCategoryItem';
const groupSelector = '*';

/** The number of `NavItem`/`NavCategoryItem`/`NavSubItem` entries anywhere in the tree (flattened, nested categories included). */
export function getNavItemCount(interactor: Interactor, containerLocator: PartLocator): Promise<number> {
  return childListHelper.countMatchingChildren(interactor, containerLocator, navItemSelector, groupSelector);
}

/** Yield a {@link NavItemDriver} for every item in the tree, in DOM order (flattened, nested categories included). */
export function iterateNavItems(host: ComponentDriver, containerLocator: PartLocator): AsyncGenerator<NavItemDriver> {
  return childListHelper.iterateMatchingChildren(host, containerLocator, navItemSelector, NavItemDriver, groupSelector);
}

/** Yield a {@link NavCategoryItemDriver} for every category trigger in the tree, in DOM order. */
export function iterateNavCategoryItems(
  host: ComponentDriver,
  containerLocator: PartLocator
): AsyncGenerator<NavCategoryItemDriver> {
  return childListHelper.iterateMatchingChildren(
    host,
    containerLocator,
    navCategoryItemSelector,
    NavCategoryItemDriver,
    groupSelector
  );
}

/** The first item (of any kind) whose visible label matches `label`, or `null` when absent. */
export async function getNavItemByLabel(
  host: ComponentDriver,
  containerLocator: PartLocator,
  label: string
): Promise<NavItemDriver | null> {
  for await (const item of iterateNavItems(host, containerLocator)) {
    if ((await item.getLabel()) === label) {
      return item;
    }
  }
  return null;
}

/** The first `NavCategoryItem` whose visible label matches `label`, or `null` when absent. */
export async function getNavCategoryByLabel(
  host: ComponentDriver,
  containerLocator: PartLocator,
  label: string
): Promise<NavCategoryItemDriver | null> {
  for await (const item of iterateNavCategoryItems(host, containerLocator)) {
    if ((await item.getLabel()) === label) {
      return item;
    }
  }
  return null;
}

/** The label of the selected item (`aria-current="page"`), or `null` when none is selected. */
export async function getSelectedNavItemLabel(
  host: ComponentDriver,
  containerLocator: PartLocator
): Promise<string | null> {
  for await (const item of iterateNavItems(host, containerLocator)) {
    if (await item.isSelected()) {
      return (await item.getLabel()) ?? null;
    }
  }
  return null;
}
