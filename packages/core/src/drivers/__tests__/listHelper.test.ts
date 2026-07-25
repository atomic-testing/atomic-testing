import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import * as locatorUtil from '../../utils/locatorUtil';
import { ComponentDriver } from '../ComponentDriver';
import { collectItemLabels, getListItemByIndex, getListItemCount, getListItemIterator } from '../listHelper';

class LeafDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const itemLocatorBase = byDataTestId('row');

/** A fake Interactor modeling a list of exactly `matchCount` items: it answers
 * `getMatchLocator` for every in-range index with the live `:nth-child` compound
 * the real primitive produces, and `undefined` beyond the match set. */
function createInteractor(matchCount: number): Interactor {
  const getMatchLocator = jest.fn(async (locator: PartLocator, index: number) =>
    index >= 0 && index < matchCount
      ? locatorUtil.append(locator, byCssSelector(`:nth-child(${index + 1})`, 'Same'))
      : undefined
  );
  return { getMatchLocator } as unknown as Interactor;
}

describe('getListItemByIndex', () => {
  it('addresses the i-th item by match index, not by tag position', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const item = await getListItemByIndex(host, itemLocatorBase, 0, LeafDriver);

    expect(interactor.getMatchLocator).toHaveBeenCalledWith(itemLocatorBase, 0);
    expect(item?.locator.map(loc => loc.selector)).toEqual(['[data-testid="row"]', ':nth-child(1)']);
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
      ':nth-child(1)',
      ':nth-child(2)',
      ':nth-child(3)',
    ]);
  });

  it('starts from the given startIndex', async () => {
    const interactor = createInteractor(3);
    const host = new LeafDriver(itemLocatorBase, interactor);

    const items = [];
    for await (const item of getListItemIterator(host, itemLocatorBase, LeafDriver, 1)) {
      items.push(item);
    }

    expect(items.map(item => item.locator.at(-1)?.selector)).toEqual([':nth-child(2)', ':nth-child(3)']);
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
