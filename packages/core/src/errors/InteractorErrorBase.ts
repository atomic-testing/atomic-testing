import { PartLocator } from '../locators';

/**
 * Base class for errors thrown at the interactor level.
 * These errors don't have access to a ComponentDriver reference,
 * only the locator that was used when the error occurred.
 */
export class InteractorErrorBase extends Error {
  constructor(
    message: string,
    public readonly locator: PartLocator
  ) {
    super(message);
  }
}
