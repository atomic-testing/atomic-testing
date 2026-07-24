import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { append } from '../../utils/locatorUtil';
import { countMatchingChildren, getMatchingChildren } from '../childListHelper';
import { ComponentDriver } from '../ComponentDriver';

// Mirrors childListHelper's own (private) position-addressing, using the same
// public append()/byCssSelector() primitives it's built from, so the fake
// Interactor below can be keyed by the exact locator each call site produces
// without reaching into the module's internals.
function anyChildAt(container: PartLocator, position: number): PartLocator {
  return append(container, byCssSelector(`> *:nth-child(${position})`));
}
function matchingChildAt(container: PartLocator, selector: string, position: number): PartLocator {
  return append(container, byCssSelector(`> ${selector}:nth-child(${position})`));
}
function matchingChildren(container: PartLocator, selector: string): PartLocator {
  return append(container, byCssSelector(`> ${selector}`));
}

function selectorKey(locator: PartLocator): string {
  return locator.map(loc => loc.selector).join('');
}

class LeafDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const container = byDataTestId('list');

describe('getMatchingChildren / iterateMatchingChildren', () => {
  it('walks past non-matching interstitial siblings instead of stopping at the first miss (regression guard)', async () => {
    // Positions: item, divider, item, divider, item. A stale build once truncated
    // enumeration at the first non-matching child (see root CLAUDE.md's
    // childListHelper trap) — this list would have miscounted 1 instead of 3.
    const kinds: Array<'item' | 'divider'> = ['item', 'divider', 'item', 'divider', 'item'];
    const existing = new Map<string, boolean>();
    kinds.forEach((kind, index) => {
      const position = index + 1;
      existing.set(selectorKey(anyChildAt(container, position)), true);
      existing.set(selectorKey(matchingChildAt(container, '.item', position)), kind === 'item');
    });

    const exists = jest.fn(async (locator: PartLocator) => existing.get(selectorKey(locator)) ?? false);
    const interactor = { exists } as unknown as Interactor;
    const host = new LeafDriver(container, interactor);

    const items = await getMatchingChildren(host, container, '.item', LeafDriver);

    expect(items.map(item => item.locator)).toEqual([
      matchingChildAt(container, '.item', 1),
      matchingChildAt(container, '.item', 3),
      matchingChildAt(container, '.item', 5),
    ]);
  });

  it('recurses into a groupSelector wrapper to reach items nested one level deep', async () => {
    // Top level: item, group(item, item), item.
    const existing = new Map<string, boolean>();
    const markPosition = (base: PartLocator, kind: 'item' | 'group', position: number) => {
      existing.set(selectorKey(anyChildAt(base, position)), true);
      existing.set(selectorKey(matchingChildAt(base, '.item', position)), kind === 'item');
      existing.set(selectorKey(matchingChildAt(base, '.group', position)), kind === 'group');
    };
    markPosition(container, 'item', 1);
    markPosition(container, 'group', 2);
    markPosition(container, 'item', 3);

    const groupLocator = matchingChildAt(container, '.group', 2);
    markPosition(groupLocator, 'item', 1);
    markPosition(groupLocator, 'item', 2);

    const exists = jest.fn(async (locator: PartLocator) => existing.get(selectorKey(locator)) ?? false);
    const interactor = { exists } as unknown as Interactor;
    const host = new LeafDriver(container, interactor);

    const items = await getMatchingChildren(host, container, '.item', LeafDriver, '.group');

    expect(items.map(item => item.locator)).toEqual([
      matchingChildAt(container, '.item', 1),
      matchingChildAt(groupLocator, '.item', 1),
      matchingChildAt(groupLocator, '.item', 2),
      matchingChildAt(container, '.item', 3),
    ]);
  });

  it('constructs each item driver with the host interactor and commutableOption', async () => {
    const existing = new Map<string, boolean>([
      [selectorKey(anyChildAt(container, 1)), true],
      [selectorKey(matchingChildAt(container, '.item', 1)), true],
    ]);
    const exists = jest.fn(async (locator: PartLocator) => existing.get(selectorKey(locator)) ?? false);
    const interactor = { exists } as unknown as Interactor;
    const host = new LeafDriver(container, interactor);

    const [item] = await getMatchingChildren(host, container, '.item', LeafDriver);

    expect(item.interactor).toBe(interactor);
  });

  it('returns an empty array when no child matches', async () => {
    const exists = jest.fn(async () => false);
    const interactor = { exists } as unknown as Interactor;
    const host = new LeafDriver(container, interactor);

    const items = await getMatchingChildren(host, container, '.item', LeafDriver);

    expect(items).toEqual([]);
  });
});

describe('countMatchingChildren', () => {
  it('counts via a single getElementCount call when no groupSelector is given', async () => {
    const getElementCount = jest.fn(async () => 3);
    const interactor = { getElementCount } as unknown as Interactor;

    const count = await countMatchingChildren(interactor, container, '.item');

    expect(count).toBe(3);
    expect(getElementCount).toHaveBeenCalledWith(matchingChildren(container, '.item'));
  });

  it('walks positions (not a single count call) and does not truncate at a non-matching sibling once a groupSelector is given', async () => {
    // Same interstitial-non-match shape as the enumeration regression guard above,
    // but exercising the position-walk counting branch (taken whenever a
    // groupSelector is supplied) rather than the flat getElementCount shortcut.
    const kinds: Array<'item' | 'divider'> = ['item', 'divider', 'item', 'divider', 'item'];
    const existing = new Map<string, boolean>();
    kinds.forEach((kind, index) => {
      const position = index + 1;
      existing.set(selectorKey(anyChildAt(container, position)), true);
      existing.set(selectorKey(matchingChildAt(container, '.item', position)), kind === 'item');
      existing.set(selectorKey(matchingChildAt(container, '.group', position)), false);
    });

    const exists = jest.fn(async (locator: PartLocator) => existing.get(selectorKey(locator)) ?? false);
    const getElementCount = jest.fn();
    const interactor = { exists, getElementCount } as unknown as Interactor;

    const count = await countMatchingChildren(interactor, container, '.item', '.group');

    expect(count).toBe(3);
    expect(getElementCount).not.toHaveBeenCalled();
  });

  it('recurses into groupSelector wrappers when counting, matching the enumeration order', async () => {
    const existing = new Map<string, boolean>();
    const markPosition = (base: PartLocator, kind: 'item' | 'group', position: number) => {
      existing.set(selectorKey(anyChildAt(base, position)), true);
      existing.set(selectorKey(matchingChildAt(base, '.item', position)), kind === 'item');
      existing.set(selectorKey(matchingChildAt(base, '.group', position)), kind === 'group');
    };
    markPosition(container, 'item', 1);
    markPosition(container, 'group', 2);
    markPosition(container, 'item', 3);

    const groupLocator = matchingChildAt(container, '.group', 2);
    markPosition(groupLocator, 'item', 1);
    markPosition(groupLocator, 'item', 2);

    const exists = jest.fn(async (locator: PartLocator) => existing.get(selectorKey(locator)) ?? false);
    const interactor = { exists } as unknown as Interactor;

    const count = await countMatchingChildren(interactor, container, '.item', '.group');

    expect(count).toBe(4);
  });
});
