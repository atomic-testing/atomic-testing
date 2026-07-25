/**
 * @jest-environment jsdom
 */
import { byDataTestId } from '../../locators/byDataTestId';
import { getMatchAddress, toMatchLocator } from '../matchAddressUtil';

function matchesOf(selector: string): Element[] {
  return Array.from(document.querySelectorAll(selector));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getMatchAddress', () => {
  // The whole point of the primitive: match order, not tag position. The first
  // match here is the SECOND <li>, which is what made `:nth-of-type(1)` — the
  // addressing this replaces — resolve nothing.
  it('addresses siblings by :nth-child so an interleaved same-tag non-item cannot shift the index', () => {
    document.body.innerHTML = '<ul><li>divider</li><li data-item>alpha</li><li data-item>beta</li></ul>';
    const matches = matchesOf('[data-item]');

    expect(getMatchAddress(matches, 0)).toEqual({ kind: 'suffix', selector: ':nth-child(2)' });
    expect(getMatchAddress(matches, 1)).toEqual({ kind: 'suffix', selector: ':nth-child(3)' });
  });

  it('counts element positions only, unaffected by text and comment nodes', () => {
    document.body.innerHTML = '<ul>text<!-- c --><li data-item>alpha</li></ul>';

    expect(getMatchAddress(matchesOf('[data-item]'), 0)).toEqual({ kind: 'suffix', selector: ':nth-child(1)' });
  });

  it('returns undefined for an out-of-range or negative index', () => {
    document.body.innerHTML = '<ul><li data-item>alpha</li></ul>';
    const matches = matchesOf('[data-item]');

    expect(getMatchAddress(matches, 1)).toBeUndefined();
    expect(getMatchAddress(matches, -1)).toBeUndefined();
    expect(getMatchAddress([], 0)).toBeUndefined();
  });

  // A `:nth-child(k)` compound is only unambiguous while no other match shares
  // the position; two lists side by side both hold a match at position 1.
  it('falls back to an absolute path when another match shares the sibling position', () => {
    document.body.innerHTML =
      '<div><ul><li data-item>a</li><li data-item>b</li></ul><ul><li data-item>c</li></ul></div>';
    const matches = matchesOf('[data-item]');

    expect(getMatchAddress(matches, 0)?.kind).toBe('path');
    // "b" sits at position 2 and nothing else does, so it keeps the live form.
    expect(getMatchAddress(matches, 1)).toEqual({ kind: 'suffix', selector: ':nth-child(2)' });
    expect(getMatchAddress(matches, 2)?.kind).toBe('path');
  });

  it('produces an absolute path that resolves to exactly the addressed element', () => {
    document.body.innerHTML =
      '<div><ul><li data-item>a</li><li data-item>b</li></ul><ul><li data-item>c</li></ul></div>';
    const matches = matchesOf('[data-item]');

    for (const index of [0, 2]) {
      const address = getMatchAddress(matches, index)!;
      expect(address.kind).toBe('path');
      expect(document.querySelectorAll(address.selector)).toHaveLength(1);
      expect(document.querySelector(address.selector)).toBe(matches[index]);
    }
  });

  it('returns undefined for an element detached from its document', () => {
    const detached = document.createElement('div');
    const child = document.createElement('span');
    detached.appendChild(child);

    expect(getMatchAddress([detached], 0)).toBeUndefined();
  });

  // Serialized into the browser by PlaywrightInteractor — see elementStateUtil's
  // equivalent guard.
  it('is a plain, self-contained function', () => {
    const source = getMatchAddress.toString();
    expect(source.startsWith('function')).toBe(true);
    expect(source).not.toMatch(/\brequire\(/);
  });
});

describe('toMatchLocator', () => {
  const base = byDataTestId('row');

  it("compounds a 'suffix' onto the base, keeping the base selector live", () => {
    const locator = toMatchLocator(base, { kind: 'suffix', selector: ':nth-child(2)' });

    expect(locator.map(loc => loc.selector)).toEqual(['[data-testid="row"]', ':nth-child(2)']);
    expect(locator.at(-1)?.relative).toBe('Same');
  });

  it("replaces the base with a 'path', anchored at the document root", () => {
    const locator = toMatchLocator(base, { kind: 'path', selector: ':root > *:nth-child(2)' });

    expect(locator.map(loc => loc.selector)).toEqual([':root > *:nth-child(2)']);
    expect(locator[0].relative).toBe('Root');
  });
});
