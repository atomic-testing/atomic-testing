import { ErrorBase } from '../ErrorBase';
import { MissingPartError, MissingPartErrorId } from '../MissingPartError';

describe('MissingPartError', () => {
  it('builds a message naming a single missing part', () => {
    const error = new MissingPartError('submit', { driverName: 'LoginFormDriver' });

    expect(error.message).toBe('The part "submit" is missing');
    expect(error.missingPartName).toBe('submit');
  });

  it('joins multiple missing part names with ", "', () => {
    const error = new MissingPartError(['email', 'password'], { driverName: 'LoginFormDriver' });

    expect(error.message).toBe('The part "email, password" is missing');
    expect(error.missingPartName).toEqual(['email', 'password']);
  });

  it('sets .name to the exported id, the discriminant catch blocks narrow on', () => {
    const error = new MissingPartError('submit', { driverName: 'LoginFormDriver' });

    expect(error.name).toBe(MissingPartErrorId);
    expect(error.name).toBe('MissingPartError');
  });

  it('retains the driver name via ErrorBase', () => {
    const error = new MissingPartError('submit', { driverName: 'LoginFormDriver' });

    expect(error.driverName).toBe('LoginFormDriver');
  });

  it('extends ErrorBase, so it is catchable as one alongside ItemNotFoundError', () => {
    const error = new MissingPartError('submit', { driverName: 'LoginFormDriver' });

    expect(error).toBeInstanceOf(ErrorBase);
  });
});
