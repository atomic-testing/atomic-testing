import { escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByRoleSource = {
  _id: 'byRole';
  value: string;
  relative: LocatorRelativePosition;
  /**
   * The verbatim `aria-label` the locator additionally filters on, when the
   * name-aware overload was used. Carried for round-trip metadata so a source
   * can reproduce the exact selector.
   */
  name?: string;
};

/**
 * Options for the name-aware {@link byRole} overload.
 */
export interface ByRoleOptions {
  /**
   * Verbatim `aria-label` to disambiguate elements that share the same `role`.
   *
   * NOTE: this matches the literal `aria-label` attribute only — it does NOT
   * resolve the computed accessible name (from `aria-labelledby`, an associated
   * `<label>`, or text content). Computed-name resolution is not CSS-expressible
   * and is the job of the forthcoming `findByRole` (deferred). Use this when the
   * element you target sets `aria-label` directly.
   */
  name?: string;
  /**
   * Relative position of the locator. Defaults to `'Descendant'`.
   */
  relative?: LocatorRelativePosition;
}

/**
 * Locate elements by their ARIA `role` attribute, optionally disambiguated by a
 * verbatim `aria-label`.
 *
 * The second argument is overloaded for backward compatibility: passing a string
 * keeps the legacy positional `relative` behaviour, while passing an options
 * object enables the `name` filter (and an optional `relative`).
 *
 * When `name` is supplied the selector becomes
 * `[role="<role>"][aria-label="<name>"]`, which is how two same-role siblings —
 * e.g. two `button`s labelled `Open` and `Close` — are told apart without
 * relying on StyleX-hashed classes. `name` matches the literal `aria-label`
 * attribute only; computed accessible names are out of scope here.
 *
 * @param value - The role value to match.
 * @param arg2 - Either the legacy positional `relative` (`LocatorRelativePosition`)
 * or a `{ name?, relative? }` options object.
 * @example
 * ```ts
 * // Legacy positional form (unchanged):
 * const root = byRole('presentation', 'Root');
 *
 * // Name-aware disambiguation of two same-role elements:
 * const openButton = byRole('button', { name: 'Open' });
 * const closeButton = byRole('button', { name: 'Close' });
 * ```
 */
export function byRole(value: string, relative?: LocatorRelativePosition): CssLocator;
export function byRole(value: string, options?: ByRoleOptions): CssLocator;
export function byRole(value: string, arg2?: LocatorRelativePosition | ByRoleOptions): CssLocator {
  const { name, relative } =
    typeof arg2 === 'string' ? { name: undefined, relative: arg2 } : { name: arg2?.name, relative: arg2?.relative };
  const resolvedRelative: LocatorRelativePosition = relative ?? 'Descendant';

  let selector = `[role="${escapeValue(value)}"]`;
  if (name !== undefined) {
    selector += `[aria-label="${escapeValue(name)}"]`;
  }

  return new CssLocator(selector, {
    relative: resolvedRelative,
    source: {
      _id: 'byRole',
      value,
      relative: resolvedRelative,
      ...(name !== undefined ? { name } : {}),
    },
  });
}
