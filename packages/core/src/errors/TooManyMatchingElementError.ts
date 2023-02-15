import { PartQueryType } from '../SceneDefinition';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends Error {
  constructor(public readonly query: PartQueryType) {
    super('Too many matching element');
    this.name = 'TooManyMatchingElementError';
  }
}
