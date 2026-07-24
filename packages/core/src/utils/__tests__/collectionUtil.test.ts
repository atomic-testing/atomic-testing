import { getDifference, toArray } from '../collectionUtil';

describe('getDifference', () => {
  it('reports values present only in "to" as toAdd, and only in "from" as toRemove', () => {
    const result = getDifference([1, 2, 3], [2, 3, 4]);

    expect(result.toAdd).toEqual(new Set([4]));
    expect(result.toRemove).toEqual(new Set([1]));
  });

  it('reports nothing to add or remove for identical collections', () => {
    const result = getDifference(['a', 'b'], ['a', 'b']);

    expect(result.toAdd.size).toBe(0);
    expect(result.toRemove.size).toBe(0);
  });

  it('treats "from" as entirely removed when "to" is empty', () => {
    const result = getDifference([1, 2], []);

    expect(result.toAdd).toEqual(new Set());
    expect(result.toRemove).toEqual(new Set([1, 2]));
  });

  it('treats "to" as entirely added when "from" is empty', () => {
    const result = getDifference([], [1, 2]);

    expect(result.toAdd).toEqual(new Set([1, 2]));
    expect(result.toRemove).toEqual(new Set());
  });

  it('de-duplicates repeated values via Set semantics', () => {
    const result = getDifference([1, 1, 2], [2, 2, 3]);

    expect(result.toAdd).toEqual(new Set([3]));
    expect(result.toRemove).toEqual(new Set([1]));
  });
});

describe('toArray', () => {
  it('wraps a single item in a new array', () => {
    expect(toArray('a')).toEqual(['a']);
  });

  it('returns an array argument unchanged (same reference, not a copy)', () => {
    const original = [1, 2, 3];

    expect(toArray(original)).toBe(original);
  });

  it('wraps a single object item without spreading its properties', () => {
    const item = { id: 1 };

    expect(toArray(item)).toEqual([item]);
  });
});
