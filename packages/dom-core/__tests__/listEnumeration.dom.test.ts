import {
  byCssSelector,
  ComponentDriver,
  ListComponentDriver,
  ListEnumerationMismatchError,
  byDataTestId,
} from '@atomic-testing/core';

import { DOMInteractor } from '../src/DOMInteractor';

class ItemDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'ItemDriver';
  }
}

class ListDriver extends ListComponentDriver<ItemDriver> {
  constructor(interactor: DOMInteractor, itemSelector: string) {
    super(byDataTestId('list'), interactor, {
      itemClass: ItemDriver,
      itemLocator: byCssSelector(itemSelector),
    });
  }
}

// The item selector is narrower than the item TAG on purpose, and that is the whole
// hazard. `:nth-of-type` counts by tag, so a non-item sibling sharing the tag holds a
// position the item selector does not match: positional addressing hits that position,
// finds nothing, and concludes the list has ended. With a bare `li` selector there is
// nothing to detect — the header simply gets counted AS an item and both reckonings
// agree on the wrong answer, which is a separate (and quieter) problem.
function mount(html: string, itemSelector: string = 'li.item'): ListDriver {
  document.body.innerHTML = html;
  return new ListDriver(new DOMInteractor(document.body), itemSelector);
}

/**
 * These cases live in `dom-core` rather than beside `listHelper` in `core` on
 * purpose. `core`'s own listHelper tests drive a fake `Interactor` that answers
 * `exists()` by regex-parsing `:nth-of-type(n)` — it MODELS the homogeneous-siblings
 * assumption, so it cannot observe the assumption being violated. Only jsdom's real
 * CSS engine resolves `:nth-of-type` the way a browser does, which is the entire
 * mechanism under test.
 */
describe('ListComponentDriver enumeration against a real DOM', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  const HEADER_LIST = `
    <ul data-testid="list">
      <li class="header">Fruits</li>
      <li class="item">Apple</li><li class="item">Banana</li><li class="item">Cherry</li>
    </ul>
  `;

  it('enumerates and counts a homogeneous list identically', async () => {
    const list = mount(`
      <ul data-testid="list">
        <li class="item">Apple</li>
        <li class="item">Banana</li>
        <li class="item">Cherry</li>
      </ul>
    `);

    expect(await list.getItemCount()).toBe(3);
    expect(await list.getItems()).toHaveLength(3);
    expect(await (await list.getItemByLabel('Cherry'))?.getText()).toBe('Cherry');
  });

  // Every shape below previously returned a silently SHORT list. The header case is
  // the worst of them: getItems() yielded an EMPTY array while getItemCount()
  // reported 3, because position 1 is the header, does not match `li.item`, and was
  // read as "the list ended here".
  it.each([
    ['a non-item header sharing the item tag', HEADER_LIST, 'li.item'],
    [
      'a same-tag separator mid-list',
      `<ul data-testid="list">
         <li class="item">Apple</li><li class="sep" role="separator"></li>
         <li class="item">Banana</li><li class="item">Cherry</li>
       </ul>`,
      'li.item',
    ],
    [
      'items wrapped one level deep',
      `<ul data-testid="list">
         <div><li class="item">Apple</li></div>
         <div><li class="item">Banana</li></div>
         <div><li class="item">Cherry</li></div>
       </ul>`,
      'li.item',
    ],
  ])('throws rather than truncating for %s', async (_label, html, selector) => {
    const list = mount(html, selector);

    await expect(list.getItems()).rejects.toThrow(ListEnumerationMismatchError);
  });

  it('reports both counts and the offending locator on the error', async () => {
    const list = mount(HEADER_LIST);

    const error = await list.getItems().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ListEnumerationMismatchError);
    const mismatch = error as ListEnumerationMismatchError;
    // Three elements match `li.item`; positional addressing reached NONE of them,
    // because `li.item:nth-of-type(1)` is the header, which is not an item.
    expect(mismatch.matchedCount).toBe(3);
    expect(mismatch.enumeratedCount).toBe(0);
    expect(mismatch.locatorDescription).toContain('li.item');
    expect(mismatch.driverName).toBe('ListComponentDriver');
  });

  // A truncated search cannot tell "absent" from "not reached", so reporting
  // absence would be reporting a result it does not have.
  it('refuses to report absence from a list it could not fully search', async () => {
    const list = mount(HEADER_LIST);

    await expect(list.getItemByLabel('Cherry')).rejects.toThrow(ListEnumerationMismatchError);
  });

  // The early-exit path makes no completeness claim, so it stays cheap and quiet
  // even on a list the full walk would reject.
  it('still resolves a label that positional addressing reaches before stopping', async () => {
    const list = mount(`
      <ul data-testid="list">
        <li class="item">Apple</li><li class="item">Banana</li>
        <li class="sep"></li><li class="item">Cherry</li>
      </ul>
    `);

    expect(await (await list.getItemByLabel('Banana'))?.getText()).toBe('Banana');
  });

  it('treats an empty list as agreement, not as a mismatch', async () => {
    const list = mount(`<ul data-testid="list"></ul>`);

    expect(await list.getItemCount()).toBe(0);
    expect(await list.getItems()).toEqual([]);
  });
});
