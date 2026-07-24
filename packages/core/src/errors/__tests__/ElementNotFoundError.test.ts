import { byDataTestId } from '../../locators/byDataTestId';
import { ElementNotFoundError, ElementNotFoundErrorId } from '../ElementNotFoundError';
import { InteractorErrorBase } from '../InteractorErrorBase';

describe('ElementNotFoundError', () => {
  it('builds a message naming the attempted action and the locator', () => {
    const error = new ElementNotFoundError(byDataTestId('submit'), 'click');

    expect(error.message).toBe('Cannot click: element not found. Locator: [data-testid="submit"]');
  });

  it('sets .name to the exported id, the discriminant catch blocks narrow on', () => {
    const error = new ElementNotFoundError(byDataTestId('submit'), 'click');

    expect(error.name).toBe(ElementNotFoundErrorId);
    expect(error.name).toBe('ElementNotFoundError');
  });

  it('retains the attempted action and a locator description derived from the locator', () => {
    const error = new ElementNotFoundError(byDataTestId('submit'), 'click');

    expect(error.action).toBe('click');
    expect(error.locatorDescription).toBe('[data-testid="submit"]');
  });

  it('extends InteractorErrorBase, so it is catchable as one', () => {
    const error = new ElementNotFoundError(byDataTestId('submit'), 'click');

    expect(error).toBeInstanceOf(InteractorErrorBase);
  });

  it('joins a multi-locator chain with ", " in the description', () => {
    const chain = [...byDataTestId('list'), ...byDataTestId('item')];
    const error = new ElementNotFoundError(chain, 'read text of');

    expect(error.locatorDescription).toBe('[data-testid="list"], [data-testid="item"]');
    expect(error.message).toBe(
      'Cannot read text of: element not found. Locator: [data-testid="list"], [data-testid="item"]'
    );
  });
});
