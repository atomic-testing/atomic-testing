import { PartSelectorType } from '../selectors/PartSelectorType';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends Error {
  constructor(public readonly query: PartSelectorType) {
    super('Too many matching element');
    this.name = TooManyMatchingElementErrorId;
  }
}
