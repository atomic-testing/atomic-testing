export interface DifferenceResult<T> {
  toAdd: ReadonlySet<T>;
  toRemove: ReadonlySet<T>;
}

export function getDifference<T>(from: Iterable<T>, to: Iterable<T>): DifferenceResult<T> {
  const fromSet = new Set(from);
  const toSet = new Set(to);

  return {
    toAdd: findNotIn(toSet, fromSet),
    toRemove: findNotIn(fromSet, toSet),
  };
}

/**
 * Find all the values in a that are not in b
 * @param a
 * @param b
 */
function findNotIn<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): ReadonlySet<T> {
  const result = new Set<T>();
  for (const value of a) {
    if (!b.has(value)) {
      result.add(value);
    }
  }
  return result;
}

export function toArray<T>(item: T | readonly T[]): T[] {
  return Array.isArray(item) ? item : ([item] as T[]);
}
