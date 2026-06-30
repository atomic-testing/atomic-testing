import { Optional } from '../dataTypes';
import { CssLocatorSource } from './CssLocatorSource';
import { LocatorComplexity } from './LocatorComplexity';
import type { LocatorRelativePosition } from './LocatorRelativePosition';
import { LocatorType } from './LocatorType';
import { CssLocatorChain, PartLocator } from './PartLocator';

export interface CssLocatorInitializer {
  relative: LocatorRelativePosition;
  source: CssLocatorSource;
}

export class CssLocator {
  private _relativePosition: LocatorRelativePosition = 'Descendant';
  private _type: LocatorType = 'css';
  private _source?: CssLocatorSource;

  constructor(
    public readonly selector: string,
    initializeValue?: Partial<CssLocatorInitializer>
  ) {
    if (initializeValue) {
      this._relativePosition = initializeValue.relative || this.relative;
      this._source = initializeValue.source || this.source;
    }
  }

  get relative(): LocatorRelativePosition {
    return this._relativePosition;
  }

  get type(): LocatorType {
    return this._type;
  }

  get source(): Optional<CssLocatorSource> {
    return this._source;
  }

  chain(...locatorsToAppend: PartLocator[]): PartLocator {
    const baseLocator: CssLocator[] = [this];
    const toAppend: CssLocator[] = locatorsToAppend.reduce((acc: CssLocator[], locator: PartLocator) => {
      if (locator instanceof CssLocator) {
        return acc.concat(locator);
      }
      return acc.concat(...(locator as CssLocatorChain));
    }, [] as CssLocator[]);

    return baseLocator.concat(toAppend);
  }

  public get complexity(): LocatorComplexity {
    return 'primitive';
  }

  /**
   * Compose additional matchers onto the SAME element, producing one compound
   * CSS selector — e.g. `[role="button"]` and `[aria-label="Open"]` together
   * become `[role="button"][aria-label="Open"]`.
   *
   * This is the ergonomic, footgun-free form of same-element composition: it
   * supersedes `locatorUtil.append(byRole('button'), byAriaLabel('Open', 'Same'))`
   * — there is no `'Same'` argument to remember (the relationship no longer has
   * to be stored on the appended child) and no wrapper call. The result keeps
   * THIS locator's position relative to its parent; the appended matchers
   * contribute only their attribute/selector fragment.
   *
   * Same-element, pure-CSS only:
   * - Put a tag-name matcher ({@link byTagName}) FIRST — a CSS type selector is
   *   only valid at the start of a compound (`input[type="text"]`, never
   *   `[type="text"]input`).
   * - Computed accessible names (`aria-labelledby` / `<label>` / text) are not
   *   CSS-expressible and stay out of scope (see #923); compose a verbatim
   *   `aria-label` via {@link byAriaLabel} instead.
   * - Linked locators ({@link byLinkedElement}) resolve at runtime and cannot be
   *   folded into a static compound; calling `.and()` on one, or passing one,
   *   throws.
   *
   * @param locators - Additional same-element matchers to compound onto this one.
   * @example
   * ```ts
   * const openButton = byRole('button').and(byAriaLabel('Open'));
   * const activeTab = byRole('tab').and(byAttribute('aria-selected', 'true'));
   * ```
   */
  and(...locators: CssLocator[]): CssLocator {
    const parts = [this, ...locators];
    for (const part of parts) {
      if (part.complexity !== 'primitive') {
        throw new Error(
          'CssLocator.and() composes same-element primitive matchers only; ' +
            'linked locators resolve at runtime and cannot be folded into a static compound.'
        );
      }
    }
    const selector = parts.map(part => part.selector).join('');
    return new CssLocator(selector, { relative: this._relativePosition });
  }

  clone(override?: Partial<CssLocatorInitializer>): CssLocator {
    return new CssLocator(this.selector, {
      relative: override?.relative ?? this._relativePosition,
      source: override?.source ?? this._source,
    });
  }
}
