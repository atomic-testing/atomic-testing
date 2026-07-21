import { CssLocatorSource } from './CssLocatorSource';
import { LocatorComplexity } from './LocatorComplexity';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export interface CssLocatorInitializer {
  relative: LocatorRelativePosition;
  source: CssLocatorSource;
}

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
