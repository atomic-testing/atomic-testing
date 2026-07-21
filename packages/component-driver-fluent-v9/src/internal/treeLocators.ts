import { byCssClass, byTagName, type PartLocator } from '@atomic-testing/core';

/**
 * Direct-child `.fui-TreeItem` selector — enumerates the items at ONE level
 * of a Fluent v9 `Tree`: either the root `Tree`'s own top-level items, or
 * (appended after {@link treeSubtreeLocator}) a single `TreeItem`'s nested
 * children.
 *
 * `'Child'`, not the default `'Descendant'`, is load-bearing: DOM audit
 * (@fluentui/react-tree@9.16.3) confirms `.fui-TreeItem` recurs at EVERY
 * nesting level (a nested item is a `.fui-TreeItem` too), so a plain
 * descendant match from a level's root would flatten the WHOLE subtree
 * instead of stopping at that one level — unlike `AccordionDriver`'s flat,
 * never-nested item list, `Tree` must be walked one level at a time. Shared
 * by {@link TreeDriver} (root-level items) and {@link TreeItemDriver}
 * (child-level items), so the one-level-only contract lives in a single
 * place — the same reason `NavDriverBase`/`NavCategoryItemDriver` share
 * `internal/navLocators.ts`.
 */
export const treeItemChildLocator: PartLocator = byCssClass('fui-TreeItem', 'Child');

/**
 * Direct-child `.fui-Tree` selector (`'Child'`-scoped, NOT role-filtered)
 * reaching a `TreeItem`'s own nested subtree (see {@link TreeItemDriver}'s
 * class doc for the full shape). At runtime that child renders as
 * `<div class="fui-Tree" role="group">` — DOM audit: Fluent stamps
 * `fui-Tree` on every `<Tree>`-rendered level, root and nested alike,
 * distinguished only by `role` (`"tree"` at the root, `"group"` when
 * nested) — but this selector doesn't need to filter on that role, since
 * scoping to the immediate child already guarantees the right element.
 * Also matches `'Child'` for the same flattening reason as
 * {@link treeItemChildLocator}: a nested subtree's OWN nested subtrees carry
 * the identical `fui-Tree` class.
 *
 * Resolves to nothing while the owning item is collapsed (Fluent's
 * `Collapse` hard-codes `unmountOnExit`, the same fully-unmounted-while-closed
 * behavior `AccordionItemDriver`'s panel documents) or when the item is a
 * leaf (no subtree ever renders for `itemType="leaf"`).
 */
export const treeSubtreeLocator: PartLocator = byCssClass('fui-Tree', 'Child');

/**
 * Locators into a `TreeItem`'s own `TreeItemLayout` slot (label + optional
 * expand chevron + optional selection control) — shared by
 * {@link TreeItemDriver} and `FlatTreeItemDriver`, since `@fluentui/react-tree`
 * ships `FlatTreeItem` as a bare re-export of `TreeItem`
 * (`export const FlatTreeItem = TreeItem;`, verified against
 * `@fluentui/react-tree@9.16.3`'s compiled source) — a `FlatTreeItem` renders
 * an IDENTICAL `.fui-TreeItemLayout` subtree to a nested `TreeItem`, so both
 * drivers read it through the same locators rather than duplicating them.
 */
export const treeItemLayoutLocator: PartLocator = byCssClass('fui-TreeItemLayout', 'Child');
export const treeItemLabelLocator: PartLocator = byCssClass('fui-TreeItemLayout__main');
export const treeItemSelectorLocator: PartLocator = byCssClass('fui-TreeItemLayout__selector');
export const treeItemNativeInputLocator: PartLocator = byTagName('input');
