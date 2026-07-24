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
 * below `matchCount`, modeling a homogeneous list of exactly that many items. */
function createInteractor(matchCount: number): Interactor {
  const exists = jest.fn(async (locator: PartLocator) => {
    const [{ selector }] = locator.slice(-1);
    const match = /:nth-of-type\((\d+)\)$/.exec(selector);
    const position = match ? Number(match[1]) : NaN;
    return position >= 1 && position <= matchCount;
  });
  return { exists } as unknown as Interactor;
}

describe('getListItemByIndex', () => {
  it('addresses the i-th item with a Same-positioned :nth-of-type locator', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(item?.locator.map(loc => loc.selector)).toEqual(['[data-testid="row"]', ':nth-of-type(1)']);
    expect(item?.locator.at(-1)?.relative).toBe('Same');
  });

  it('returns null when no element exists at that index', async () => {
    const interactor = createInteractor(0);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(item).toBeNull();
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
