import { CssLocator, CssLocatorInitializer } from './CssLocator';
import { LocatorComplexity } from './LocatorComplexity';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type AccessibleRoleLocatorSource = {
  _id: 'byAccessibleRole';
  role: string;
  name?: string;
};

/**
 * The only two {@link LocatorRelativePosition} values `AccessibleRoleLocator`
 * resolution actually honors — `'Root'` escapes to the document root,
 * anything else (the `'Descendant'` default) scopes to the preceding chain
 * (or the interactor's own root when there is none). `'Same'`/`'Child'` have
 * no accname-search equivalent (`'Same'` means "compound onto the same
 * element," which conflicts with "search for a new element by name"; `'Child'`
 * would need result filtering `queryAllByRole`/`getByRole` don't offer) — this
 * narrower type makes passing them a compile error instead of a silent
 * fallback to `'Descendant'` behavior.
 */
export type AccessibleRoleLocatorRelativePosition = Extract<LocatorRelativePosition, 'Root' | 'Descendant'>;

export interface AccessibleRoleLocatorInitializer {
  name?: string;
  relative?: AccessibleRoleLocatorRelativePosition;
}

/**
 * A locator that resolves by ARIA role plus the COMPUTED accessible name (the
 * accname algorithm: `aria-labelledby` id-refs, an associated `<label>`,
 * wrapping/`title` text, and visible descendant text) — built by `findByRole`,
 * never directly.
 *
 * This is the one locator kind with NO CSS representation: the accessible name
 * is the output of a multi-node graph traversal that no CSS selector can
 * express (see [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md)
 * and the design in [ADR 0001, Decision B](https://github.com/atomic-testing/atomic-testing/blob/main/docs/adr/0001-interactor-primitives-and-name-aware-role.md)).
 * `selector` (inherited from {@link CssLocator}) is therefore a
 * human-readable DIAGNOSTIC string only — e.g. `role=button name="Save"` — for
 * error messages; it is never run as CSS. Resolution instead happens inside
 * each interactor, backed by an engine that already implements accname:
 * `@testing-library/dom`'s `queryAllByRole` in `DOMInteractor`, Playwright's
 * `Locator.getByRole`/`Page.getByRole` in `PlaywrightInteractor`.
 *
 * `name` matching is always exact and case-sensitive, in BOTH engines — a
 * deliberate simplification, not an oversight. `@testing-library/dom`'s
 * `getByRole` only supports exact string comparison for a string `name` (no
 * substring/fuzzy mode exists in its public API for that case); Playwright's
 * `getByRole` defaults to fuzzy substring matching instead. Rather than expose
 * an `exact` toggle that only ONE engine could honor — a correctness trap for
 * a library whose entire contract is "the same suite runs identically in both
 * environments" — `PlaywrightInteractor` always passes `exact: true`,
 * matching jsdom's only mode.
 *
 * Composition: an `AccessibleRoleLocator` MUST be the last (or only) segment
 * of a {@link PartLocator} chain — everything before it resolves normally (by
 * CSS) to a scope container the accname search runs within; nothing may
 * follow it (see `locatorUtil.splitAtAccessibleRoleLocator`). Its
 * `complexity` is `'accessibleRole'`, distinct from `'primitive'`, so
 * `locatorUtil.and()` — same-element CSS compounding — already rejects it via
 * the same "primitive chains only" guard that rejects a linked locator.
 *
 * @see findByRole
 */
export class AccessibleRoleLocator extends CssLocator {
  private readonly _name?: string;

  constructor(
    public readonly role: string,
    initializeValue: AccessibleRoleLocatorInitializer & Partial<CssLocatorInitializer>
  ) {
    const diagnosticSelector = `role=${role}${initializeValue.name != null ? ` name=${JSON.stringify(initializeValue.name)}` : ''}`;
    super(diagnosticSelector, initializeValue);
    this._name = initializeValue.name;
  }

  override get complexity(): LocatorComplexity {
    return 'accessibleRole';
  }

  /**
   * Narrows {@link CssLocator.relative}'s return type: the constructor only
   * ever accepts {@link AccessibleRoleLocatorRelativePosition}, so every
   * instance's underlying value is already within that narrower set — this
   * cast just reflects that guarantee in the type, so `clone()` doesn't need
   * one of its own.
   */
  override get relative(): AccessibleRoleLocatorRelativePosition {
    return super.relative as AccessibleRoleLocatorRelativePosition;
  }

  get name(): string | undefined {
    return this._name;
  }

  override clone(
    override?: Partial<AccessibleRoleLocatorInitializer> & Partial<CssLocatorInitializer>
  ): AccessibleRoleLocator {
    return new AccessibleRoleLocator(this.role, {
      relative: override?.relative ?? this.relative,
      source: override?.source,
      name: override?.name ?? this._name,
    });
  }
}
