import { byDataTestId } from '../../locators/byDataTestId';
import { InteractorErrorBase } from '../InteractorErrorBase';
import { LocatorResolutionError, LocatorResolutionErrorId } from '../LocatorResolutionError';

describe('LocatorResolutionError', () => {
  it('builds a message naming the reason and the locator', () => {
    const error = new LocatorResolutionError(byDataTestId('submit'), 'match target of LinkedCssLocator not found');

    expect(error.message).toBe(
      'Cannot resolve locator: match target of LinkedCssLocator not found. Locator: [data-testid="submit"]'
    );
  });

  it('sets .name to the exported id, the discriminant catch blocks narrow on', () => {
    const error = new LocatorResolutionError(byDataTestId('submit'), 'reason');

    expect(error.name).toBe(LocatorResolutionErrorId);
    expect(error.name).toBe('LocatorResolutionError');
  });

  it('retains a locator description derived from the locator', () => {
    const error = new LocatorResolutionError(byDataTestId('submit'), 'reason');

    expect(error.locatorDescription).toBe('[data-testid="submit"]');
  });

  it('extends InteractorErrorBase, so it is catchable as one alongside ElementNotFoundError', () => {
    const error = new LocatorResolutionError(byDataTestId('submit'), 'reason');

    expect(error).toBeInstanceOf(InteractorErrorBase);
  });
});
