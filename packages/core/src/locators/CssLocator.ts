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

function isValidRelativePosition(value: any): value is LocatorRelativePosition {
  return value === 'Root' || value === 'Descendant' || value === 'Same';
}

export class CssLocator {
  private _relativePosition: LocatorRelativePosition = 'Descendant';
  private _type: LocatorType = 'css';
  private _source?: CssLocatorSource;

  constructor(
    public readonly selector: string,
    initializeValue?: Partial<CssLocatorInitializer>
  ) {
    if (!selector || selector.trim() === '') {
      throw new Error('CSS selector cannot be empty');
    }

    if (initializeValue) {
      if (initializeValue.relative !== undefined && !isValidRelativePosition(initializeValue.relative)) {
        throw new Error(`Invalid relative position: ${initializeValue.relative}`);
      }
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

  clone(override?: Partial<CssLocatorInitializer>): CssLocator {
    return new CssLocator(this.selector, {
      relative: override?.relative ?? this._relativePosition,
      source: override?.source ?? this._source,
    });
  }
}
