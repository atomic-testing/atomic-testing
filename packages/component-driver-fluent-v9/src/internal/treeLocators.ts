import { byCssClass, type PartLocator } from '@atomic-testing/core';

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
 * Direct-child `.fui-Tree[role="group"]` selector reaching a `TreeItem`'s own
 * nested subtree (see {@link TreeItemDriver}'s class doc for the full shape).
 * Also matches `'Child'` for the same flattening reason as
 * {@link treeItemChildLocator}: a nested subtree's OWN nested subtrees carry
 * the identical `fui-Tree` class (DOM audit — Fluent stamps `fui-Tree` on
 * every `<Tree>`-rendered level, root and nested alike, distinguished only by
 * `role` — `"tree"` at the root, `"group"` when nested — which this selector
 * does not need to check, since scoping to the immediate child already
 * guarantees the right element).
 *
 * Resolves to nothing while the owning item is collapsed (Fluent's
 * `Collapse` hard-codes `unmountOnExit`, the same fully-unmounted-while-closed
 * behavior `AccordionItemDriver`'s panel documents) or when the item is a
 * leaf (no subtree ever renders for `itemType="leaf"`).
 */
export const treeSubtreeLocator: PartLocator = byCssClass('fui-Tree', 'Child');
