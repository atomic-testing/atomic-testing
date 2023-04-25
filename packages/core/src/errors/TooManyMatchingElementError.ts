import { ComponentDriver } from '../drivers/ComponentDriver';
import { PartLocator } from '../locators/PartLocator';
import { ErrorBase } from './ErrorBase';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends ErrorBase {
  constructor(public readonly query: PartLocator, public readonly driver: ComponentDriver<any>) {
    super('Too many matching element', driver);
    this.name = TooManyMatchingElementErrorId;
  }
}
