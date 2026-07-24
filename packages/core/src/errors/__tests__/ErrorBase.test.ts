import { ErrorBase } from '../ErrorBase';

describe('ErrorBase', () => {
  it('carries the given message and the driver name only (a serializable snapshot, not the driver itself)', () => {
    const error = new ErrorBase('something went wrong', { driverName: 'MyDriver' });

    expect(error.message).toBe('something went wrong');
    expect(error.driverName).toBe('MyDriver');
  });

  it('is a real Error instance, catchable alongside native errors', () => {
    const error = new ErrorBase('boom', { driverName: 'MyDriver' });

    expect(error).toBeInstanceOf(Error);
  });

  it('does not set a custom .name — subclasses are responsible for their own discriminant', () => {
    // ErrorBase itself is never thrown directly; every real error (MissingPartError,
    // ItemNotFoundError, ...) sets its own `.name` after calling super(). Documenting
    // the base's default here makes that responsibility explicit.
    const error = new ErrorBase('boom', { driverName: 'MyDriver' });

    expect(error.name).toBe('Error');
  });

  it('accepts anything name-bearing as the driver, not only a real ComponentDriver', () => {
    const error = new ErrorBase('boom', { driverName: 'DuckTypedDriver' });

    expect(error.driverName).toBe('DuckTypedDriver');
  });
});
