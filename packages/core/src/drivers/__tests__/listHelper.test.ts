import { ListEnumerationMismatchError } from '../../errors/ListEnumerationMismatchError';
import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { ComponentDriver } from '../ComponentDriver';
import { collectItemLabels, getListItemByIndex, getListItemCount, getListItemIterator } from '../listHelper';

class LeafDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const itemLocatorBase = byDataTestId('row');

/** A fake Interactor whose `exists()` answers true for :nth-of-type positions
 * below `positionCount`, modeling a homogeneous list of exactly that many items.
 *
 * `getElementCount` answers `matchCount`, which defaults to agreeing with the
 * positional view. Passing the two separately is what lets a test model a
 * NON-homogeneous list — the disagreement between "positions walked" and "elements
 * matched" IS the defect — but note this fake can only model the disagreement, not
 * produce it: it parses `:nth-of-type(n)` out of the selector rather than resolving
 * it, so it encodes the homogeneity assumption by construction. The real-DOM
 * consequences are covered in dom-core/__tests__/listEnumeration.dom.test.ts. */
function createInteractor(positionCount: number, matchCount: number = positionCount): Interactor {
  const exists = jest.fn(async (locator: PartLocator) => {
    const [{ selector }] = locator.slice(-1);
    const match = /:nth-of-type\((\d+)\)$/.exec(selector);
    const position = match ? Number(match[1]) : NaN;
    return position >= 1 && position <= positionCount;
  });
  const getElementCount = jest.fn(async () => matchCount);
  return { exists, getElementCount } as unknown as Interactor;
}

describe('getListItemByIndex', () => {
  it('addresses the i-th item with a Same-positioned :nth-of-type locator', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(item?.locator.map(loc => loc.selector)).toEqual(['[data-testid="row"]', ':nth-of-type(1)']);
    expect(item?.locator.at(-1)?.relative).toBe('Same');
  });

  // Absence is `undefined`, never `null` — ADR-006 §7. Asserted with toBeUndefined
  // rather than a loose falsy check so a regression back to `null` fails here.
  it('returns undefined when no element exists at that index', async () => {
    const interactor = createInteractor(0);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(item).toBeUndefined();
  });

  it('constructs the item driver with the host interactor and commutableOption', async () => {
    const interactor = createInteractor(1);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(item?.interactor).toBe(interactor);
  });
});

describe('getListItemIterator', () => {
  it('yields one item per index until the index stops existing', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const items = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver)) {
      items.push(item);
    }

    expect(items).toHaveLength(3);
    expect(items.map(item => item.locator.at(-1)?.selector)).toEqual([
      ':nth-of-type(1)',
      ':nth-of-type(2)',
      ':nth-of-type(3)',
    ]);
  });

  it('starts from the given startIndex', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const items = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver, 1)) {
      items.push(item);
    }

    expect(items.map(item => item.locator.at(-1)?.selector)).toEqual([':nth-of-type(2)', ':nth-of-type(3)']);
  });

  it('yields nothing when the list is empty', async () => {
    const interactor = createInteractor(0);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const items = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver)) {
      items.push(item);
    }

    expect(items).toEqual([]);
  });

  // Truncation used to be silent, which made it worse than a failure: the caller got
  // a short array indistinguishable from a genuinely short list.
  it('throws when a completed walk reached fewer items than the locator matches', async () => {
    const interactor = createInteractor(2, 5);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const walk = async () => {
      for await (const _ of getListItemIterator(host, itemLocatorBase, LeafDriver)) {
        // drain
      }
    };

    await expect(walk()).rejects.toThrow(ListEnumerationMismatchError);
    await expect(walk()).rejects.toMatchObject({ matchedCount: 5, enumeratedCount: 2 });
  });

  // Regression guard for a false positive this check originally had, caught by MUI X's
  // DataGrid suites. `startIndex` is an offset into TAG positions, not into matched
  // elements: DataGridRowDriverBase skips a filler <div> that holds tag position 1 while
  // matching none of the [role=columnheader] elements the locator counts. So "walked 5,
  // matched 5, started at 1" is correct and must not be read as a shortfall of one.
  it('leaves an offset walk unchecked rather than misreading the offset as a shortfall', async () => {
    const interactor = createInteractor(6, 5);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const items = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver, 1)) {
      items.push(item);
    }

    expect(items).toHaveLength(5);
  });

  // A consumer that stops early is not claiming it saw everything, so it must not
  // pay for the check — nor be failed by it.
  it('does not check completeness when the consumer breaks out early', async () => {
    const interactor = createInteractor(2, 5);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const firstOnly = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver)) {
      firstOnly.push(item);
      break;
    }

    expect(firstOnly).toHaveLength(1);
    expect(interactor.getElementCount).not.toHaveBeenCalled();
  });
});

describe('getListItemCount', () => {
  it('delegates directly to interactor.getElementCount(itemLocatorBase), with no per-item probing', async () => {
    const getElementCount = jest.fn().mockResolvedValue(5);
    const interactor = { getElementCount } as unknown as Interactor;
    const host = new LeafDriver(itemLocatorBase, interactor);

    const count = await getListItemCount(host, itemLocatorBase);

    expect(count).toBe(5);
    expect(getElementCount).toHaveBeenCalledWith(itemLocatorBase);
  });
});

describe('collectItemLabels', () => {
  it('collects labels in order, filtering out null and undefined', async () => {
    const items = [
      { getLabel: jest.fn().mockResolvedValue('First') },
      { getLabel: jest.fn().mockResolvedValue(null) },
      { getLabel: jest.fn().mockResolvedValue('Third') },
      { getLabel: jest.fn().mockResolvedValue(undefined) },
    ];

    const labels = await collectItemLabels(items);

    expect(labels).toEqual(['First', 'Third']);
  });

  it('returns an empty array when every label is absent', async () => {
    const items = [
      { getLabel: jest.fn().mockResolvedValue(null) },
      { getLabel: jest.fn().mockResolvedValue(undefined) },
    ];

    const labels = await collectItemLabels(items);

    expect(labels).toEqual([]);
  });

  it('returns an empty array for an empty item list', async () => {
    expect(await collectItemLabels([])).toEqual([]);
  });
});
