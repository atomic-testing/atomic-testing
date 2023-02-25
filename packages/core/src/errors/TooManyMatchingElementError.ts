import { PartLocatorType } from '../locators/PartLocatorType';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends Error {
  constructor(public readonly query: PartLocatorType) {
    super('Too many matching element');
    this.name = TooManyMatchingElementErrorId;
  }
}
