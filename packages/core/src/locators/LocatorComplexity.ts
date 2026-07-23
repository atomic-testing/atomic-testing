/**
 * - `'primitive'` — a single, static CSS fragment (`byRole`, `byAttribute`, …).
 * - `'linked'` — resolves at runtime by reading another element's value
 *   ({@link LinkedCssLocator}); cannot be folded into a static compound.
 * - `'accessibleRole'` — resolves by the ARIA role + COMPUTED accessible name
 *   ({@link AccessibleRoleLocator}, built by `findByRole`); has no CSS
 *   representation at all — see [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md)
 *   and #923.
 */
export type LocatorComplexity = 'primitive' | 'linked' | 'accessibleRole';
