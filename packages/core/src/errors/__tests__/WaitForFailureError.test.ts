import { defaultWaitForOption } from '../../drivers/WaitForOption';
import { byDataTestId } from '../../locators/byDataTestId';
import { InteractorErrorBase } from '../InteractorErrorBase';
import { WaitForFailureError, WaitForFailureErrorId } from '../WaitForFailureError';

describe('WaitForFailureError', () => {
  it('builds a message naming the condition, timeout, and locator', () => {
    const error = new WaitForFailureError(byDataTestId('submit'), {
      ...defaultWaitForOption,
      condition: 'visible',
      timeoutMs: 5000,
    });

    expect(error.message).toBe('Wait for element to be visible failed after 5000ms: [data-testid="submit"]');
  });

  it('sets .name to the exported id, the discriminant catch blocks narrow on', () => {
    const error = new WaitForFailureError(byDataTestId('submit'), defaultWaitForOption);

    expect(error.name).toBe(WaitForFailureErrorId);
    expect(error.name).toBe('WaitForFailureError');
  });

  it('retains a locator description derived from the locator', () => {
    const error = new WaitForFailureError(byDataTestId('submit'), defaultWaitForOption);

    expect(error.locatorDescription).toBe('[data-testid="submit"]');
  });

  it('extends InteractorErrorBase, so it is catchable as one alongside ElementNotFoundError', () => {
    const error = new WaitForFailureError(byDataTestId('submit'), defaultWaitForOption);

    expect(error).toBeInstanceOf(InteractorErrorBase);
  });
});
