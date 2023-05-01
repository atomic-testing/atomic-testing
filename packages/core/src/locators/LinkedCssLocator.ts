import { byDataTestId } from './byDataTestId';
import { CssLocator, CssLocatorInitializer } from './CssLocator';
import { LocatorComplexity } from './LocatorComplexity';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocator } from './PartLocator';

export type LinkedCssLocatorValueExtractType = 'text' | 'attribute';

export interface LinkedCssLocatorAttributeValueExtract {
  type: 'attribute';
  attributeName: string;
}

export type LinkedCssLocatorValueExtract = LinkedCssLocatorAttributeValueExtract;

export type LinkedCssLocatorSource = {
  _id: 'byLinkedCssLocatorSource';
  relative: LocatorRelativePosition;
  valueExtract: LinkedCssLocatorValueExtract;

  matchingTargetLocator: PartLocator;
  matchingTargetValueExtract: LinkedCssLocatorValueExtract;
};

export interface LinkedCssLocatorInitializer {
  valueExtract: LinkedCssLocatorValueExtract;

  matchingTargetLocator: PartLocator;
  matchingTargetValueExtract: LinkedCssLocatorValueExtract;
}

export class LinkedCssLocator extends CssLocator {
  private _valueExtract: LinkedCssLocatorValueExtract = {
    type: 'attribute',
    attributeName: 'value',
  };

  _matchingTargetLocator: PartLocator = byDataTestId('not-set');
  _matchingTargetValueExtract: LinkedCssLocatorValueExtract = {
    type: 'attribute',
    attributeName: 'value',
  };

  constructor(selector: string, initializeValue: LinkedCssLocatorInitializer & Partial<CssLocatorInitializer>) {
    super(selector, initializeValue);
    this._valueExtract = initializeValue.valueExtract;
    this._matchingTargetLocator = initializeValue.matchingTargetLocator;
    this._matchingTargetValueExtract = initializeValue.matchingTargetValueExtract;
  }

  override get complexity(): LocatorComplexity {
    return 'linked';
  }

  get valueExtract(): LinkedCssLocatorValueExtract {
    return this._valueExtract;
  }

  get matchingTargetLocator(): PartLocator {
    return this._matchingTargetLocator;
  }

  get matchingTargetValueExtract(): LinkedCssLocatorValueExtract {
    return this._matchingTargetValueExtract;
  }

  clone(override?: Partial<LinkedCssLocatorInitializer> & Partial<CssLocatorInitializer>): LinkedCssLocator {
    return new LinkedCssLocator(this.selector, {
      relative: override?.relative ?? this.relative,
      source: override?.source ?? this.source,
      valueExtract: override?.valueExtract ?? this._valueExtract,
      matchingTargetLocator: override?.matchingTargetLocator ?? this._matchingTargetLocator,
      matchingTargetValueExtract: override?.matchingTargetValueExtract ?? this._matchingTargetValueExtract,
    });
  }
}
