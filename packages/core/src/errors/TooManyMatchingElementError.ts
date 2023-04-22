import { ComponentDriver } from '../drivers/ComponentDriver';
import { PartLocatorType } from '../locators/PartLocatorType';
import { ErrorBase } from './ErrorBase';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends ErrorBase {
  constructor(public readonly query: PartLocatorType, public readonly driver: ComponentDriver<any>) {
    super('Too many matching element', driver);
    this.name = TooManyMatchingElementErrorId;
  }
}
