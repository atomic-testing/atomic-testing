import { byDataTestId } from '../../locators/byDataTestId';
import { ErrorBase } from '../ErrorBase';
import { ItemNotFoundError, ItemNotFoundErrorId } from '../ItemNotFoundError';

describe('ItemNotFoundError', () => {
  it('builds a default message from a locator query', () => {
    const error = new ItemNotFoundError(byDataTestId('row'), { driverName: 'ListDriver' });

    // Two spaces after "found." is intentional — matches the literal template in
    // ItemNotFoundError's source; a stray reformat there would be a real regression.
    expect(error.message).toBe('Item not found.  Locator: [data-testid="row"]');
  });

  it('builds a default message from a human-readable string query', () => {
    const error = new ItemNotFoundError('row labeled "Alice"', { driverName: 'ListDriver' });

    expect(error.message).toBe('Item not found.  Locator: row labeled "Alice"');
    expect(error.locatorDescription).toBe('row labeled "Alice"');
  });

  it('lets a subclass override the generated message with its own phrasing', () => {
    const error = new ItemNotFoundError(byDataTestId('row'), { driverName: 'MenuDriver' }, 'No menu item matched');

    expect(error.message).toBe('No menu item matched');
    // The override replaces the message only — locatorDescription is still derived.
    expect(error.locatorDescription).toBe('[data-testid="row"]');
  });

  it('sets .name to the exported id, the discriminant catch blocks narrow on', () => {
    const error = new ItemNotFoundError(byDataTestId('row'), { driverName: 'ListDriver' });

    expect(error.name).toBe(ItemNotFoundErrorId);
    expect(error.name).toBe('ItemNotFoundError');
  });

  it('retains the driver name via ErrorBase', () => {
    const error = new ItemNotFoundError(byDataTestId('row'), { driverName: 'ListDriver' });

    expect(error.driverName).toBe('ListDriver');
  });

  it('extends ErrorBase, so it is catchable as one alongside MissingPartError', () => {
    const error = new ItemNotFoundError(byDataTestId('row'), { driverName: 'ListDriver' });

    expect(error).toBeInstanceOf(ErrorBase);
  });
});
