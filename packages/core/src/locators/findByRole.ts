import { AccessibleRoleLocator } from './AccessibleRoleLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';
import type { PartLocator } from './PartLocator';

/**
 * Locate an element by its ARIA `role` plus its COMPUTED accessible name — the
 * accname algorithm: `aria-labelledby` id-refs, an associated `<label>`,
 * wrapping/`title` text, and (unlike {@link byAriaLabel}) plain visible text
 * content. This is the common case for a design system that labels controls
 * with visible text rather than a literal `aria-label` attribute.
 *
 * Resolution is NOT CSS: the accessible name is computed by a multi-node graph
 * traversal no CSS selector can express (see
 * [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md)).
 * Each interactor resolves it internally via an engine that already implements
 * accname — `@testing-library/dom`'s `getByRole` in jsdom, Playwright's
 * `Locator.getByRole`/`Page.getByRole` in the browser. `name` matching is
 * always exact and case-sensitive in both engines (see
 * {@link AccessibleRoleLocator} for why there is no `exact` option). Composing
 * this with a preceding locator scopes the search to that ancestor's subtree
 * (e.g. `locatorUtil.append(dialogLocator, findByRole('button', 'Save'))`
 * finds "Save" only within the dialog); it must be the LAST segment of a
 * chain — nothing can be appended after it.
 *
 * Use `findByRole` when the name comes from visible text/`<label>`/
 * `aria-labelledby`; use {@link byAriaLabel} (composed via {@link
 * locatorUtil.and}) when the name is a verbatim `aria-label` attribute — that
 * stays a pure-CSS match with no accname cost.
 *
 * @param role - The ARIA role value to match, e.g. `'button'`, `'link'`.
 * @param name - The computed accessible name to match, exact and
 * case-sensitive. Omit to match by role alone (equivalent to {@link byRole}
 * but accname-resolved).
 * @param relative - Relative position of the locator. Defaults to `'Descendant'`.
 * @example
 * ```ts
 * const saveButton = findByRole('button', 'Save');
 * const scopedSaveButton = locatorUtil.append(dialogLocator, findByRole('button', 'Save'));
 * ```
 */
export function findByRole(role: string, name?: string, relative: LocatorRelativePosition = 'Descendant'): PartLocator {
  return [new AccessibleRoleLocator(role, { name, relative })];
}
