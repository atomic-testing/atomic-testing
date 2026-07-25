import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { IComponentDriverOption } from '../../partTypes';
import { ComponentDriver } from '../ComponentDriver';
import { ListComponentDriver } from '../ListComponentDriver';

class LeafDriver extends ComponentDriver {
  get driverName(): string {
    return 'LeafDriver';
  }
}

/** Exposes the protected item-resolution accessors so the nested case is assertable. */
class ProbeListDriver<ItemT extends ComponentDriver = LeafDriver> extends ListComponentDriver<ItemT> {
  itemLocator(): PartLocator {
    return this.getItemLocator();
  }

  itemClass() {
    return this.getItemClass();
  }
}

const stubInteractor = {} as Interactor;

function createList(option: Partial<IComponentDriverOption> = {}) {
  return new ProbeListDriver(byDataTestId('menu'), stubInteractor, {
    itemClass: LeafDriver,
    itemLocator: byCssSelector('li.item'),
    ...option,
  });
}

describe('ListComponentDriver.commutableOption', () => {
  it('carries none of the list-specific option keys', () => {
    const list = createList();

    expect(Object.keys(list.commutableOption)).toEqual([]);
    expect(list.commutableOption).not.toHaveProperty('itemClass');
    expect(list.commutableOption).not.toHaveProperty('itemLocator');
  });

  it("still forwards a caller's pass-through option from the ScenePart", () => {
    const list = createList({ theme: 'dark' } as Partial<IComponentDriverOption>);

    expect(list.commutableOption).toEqual({ theme: 'dark' });
  });

  it("does not hand a nested list the parent list's item configuration", () => {
    const parent = createList();

    // How the list helpers build an item driver: `new driverClass(itemLocator,
    // host.interactor, host.commutableOption)`. When that item driver is itself a
    // list (a submenu, a tree branch), it must NOT inherit the parent's items.
    const nested = new ProbeListDriver(byDataTestId('submenu'), stubInteractor, parent.commutableOption as never);

    expect(nested.itemLocator().map(loc => loc?.selector)).not.toContain('li.item');
    expect(nested.itemClass()).not.toBe(LeafDriver);
  });

  it("uses its OWN item configuration, unaffected by the parent's", () => {
    const parent = createList();
    const nested = new ProbeListDriver(byDataTestId('submenu'), stubInteractor, {
      ...(parent.commutableOption as object),
      itemClass: LeafDriver,
      itemLocator: byCssSelector('li.sub-item'),
    });

    expect(nested.itemLocator().map(loc => loc.selector)).toEqual(['[data-testid="submenu"]', 'li.sub-item']);
  });
});
