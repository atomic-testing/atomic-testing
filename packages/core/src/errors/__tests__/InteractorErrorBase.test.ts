import { InteractorErrorBase } from '../InteractorErrorBase';

describe('InteractorErrorBase', () => {
  it('carries the given message and a serializable locatorDescription', () => {
    const error = new InteractorErrorBase('element not found', '[data-testid="submit"]');

    expect(error.message).toBe('element not found');
    expect(error.locatorDescription).toBe('[data-testid="submit"]');
  });

  it('is a real Error instance, catchable alongside native errors', () => {
    const error = new InteractorErrorBase('boom', 'description');

    expect(error).toBeInstanceOf(Error);
  });

  it('does not set a custom .name — subclasses are responsible for their own discriminant', () => {
    // Mirrors ErrorBase: InteractorErrorBase is never thrown directly, every real
    // error (ElementNotFoundError, LocatorResolutionError, WaitForFailureError)
    // sets its own `.name` after calling super().
    const error = new InteractorErrorBase('boom', 'description');

    expect(error.name).toBe('Error');
  });
});
