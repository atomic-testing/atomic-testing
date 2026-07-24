import { CssLocatorSource } from './CssLocatorSource';
import { LocatorComplexity } from './LocatorComplexity';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export interface CssLocatorInitializer {
  relative: LocatorRelativePosition;
  source: CssLocatorSource;
}

/**
 * The primitive `PartLocator` element: a single CSS selector, optionally
 * carrying its {@link LocatorRelativePosition} (how it composes with an
 * ancestor locator) and descriptive {@link CssLocatorSource}. Every `by*`
 * locator builder (`byDataTestId`, `byRole`, `byCssSelector`, ...) produces one
 * of these; a `PartLocator` chain is an array of them.
 */
export class CssLocator {
  private _relativePosition: LocatorRelativePosition = 'Descendant';
  private _source?: CssLocatorSource;

  constructor(
    public readonly selector: string,
    initializeValue?: Partial<CssLocatorInitializer>
  ) {
    if (initializeValue) {
      this._relativePosition = initializeValue.relative || this.relative;
      this._source = initializeValue.source;
    }
  }

  get relative(): LocatorRelativePosition {
    return this._relativePosition;
  }

  public get complexity(): LocatorComplexity {
    return 'primitive';
  }

  clone(override?: Partial<CssLocatorInitializer>): CssLocator {
    return new CssLocator(this.selector, {
      relative: override?.relative ?? this._relativePosition,
      source: override?.source ?? this._source,
    });
  }
}
