import { PartLocator } from '../locators/PartLocator';
import { getLocatorInfoForErrorLog } from '../utils/locatorUtil';
import { ErrorBase } from './ErrorBase';

export const TooManyMatchingElementErrorId = 'TooManyMatchingElementError';

export class TooManyMatchingElementError extends ErrorBase {
  readonly locatorDescription: string;

  constructor(query: PartLocator, driver: { driverName: string }) {
    super('Too many matching element', driver);
    this.locatorDescription = getLocatorInfoForErrorLog(query);
    this.name = TooManyMatchingElementErrorId;
  }
}
