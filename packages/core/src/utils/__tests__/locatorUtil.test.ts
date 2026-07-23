import { Interactor } from '../../interactor/Interactor';
import { byAriaLabel } from '../../locators/byAriaLabel';
import { byAttribute } from '../../locators/byAttribute';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import { byLinkedElement } from '../../locators/byLinkedElement';
import { byRole } from '../../locators/byRole';
import { byTagName } from '../../locators/byTagName';
import { and, append, documentRootSelector, overrideLocatorRelativePosition, toCssSelector } from '../locatorUtil';

// toCssSelector only consults the interactor to resolve LinkedCssLocators; the
// plain-CSS chains exercised here never touch it, so a bare stub is enough.
const stubInteractor = {} as Interactor;

describe('toCssSelector', () => {
  test('reduces an empty locator chain to the portable document-root selector (#1048)', async () => {
    // The engine-root locator ([]) previously reduced to '', which throws a CSS
    // parse error in both jsdom and Chromium.
    expect(await toCssSelector([], stubInteractor)).toBe(documentRootSelector);
    expect(documentRootSelector).toBe(':root');
  });

  test('leaves a single non-empty locator unchanged', async () => {
    expect(await toCssSelector(byDataTestId('submit'), stubInteractor)).toBe('[data-testid="submit"]');
  });

  test('joins a descendant chain with a space separator', async () => {
    const chain = append(byCssSelector('.parent'), byCssSelector('.child'));
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent .child');
  });

  test('does not insert a separator for a Same-level locator', async () => {
    const chain = append(byCssSelector('.parent'), byCssSelector('.self', 'Same'));
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent.self');
  });

  test('joins a Child-level locator with the child combinator (#1058)', async () => {
    const chain = append(byCssSelector('.parent'), byCssSelector('.child', 'Child'));
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child');
  });

  test('mixes descendant, child, and same combinators in one chain (#1058)', async () => {
    const chain = append(
      byCssSelector('.list'),
      byCssSelector('.row', 'Child'),
      byCssSelector('.active', 'Same'),
      byCssSelector('.icon')
    );
    expect(await toCssSelector(chain, stubInteractor)).toBe('.list > .row.active .icon');
  });

  test('does not emit a leading child combinator when a Child locator heads the chain (#1058)', async () => {
    // A child combinator has no left operand at the head of a selector; the head
    // statement must stay bare rather than produce an invalid `> .child`.
    const chain = byCssSelector('.child', 'Child');
    expect(await toCssSelector(chain, stubInteractor)).toBe('.child');
  });

  test('emits the child combinator after a Root-sliced prefix (#1058)', async () => {
    // getEffectiveLocator slices at the Root, which becomes the bare head; the
    // following Child must still combine against it.
    const chain = append(byCssSelector('.ignored'), byCssSelector('.root', 'Root'), byCssSelector('.child', 'Child'));
    expect(await toCssSelector(chain, stubInteractor)).toBe('.root > .child');
  });

  test('emits the child combinator after a Same-level compound (#1058)', async () => {
    const chain = append(byCssSelector('.a'), byCssSelector('.b', 'Same'), byCssSelector('.c', 'Child'));
    expect(await toCssSelector(chain, stubInteractor)).toBe('.a.b > .c');
  });

  test('carries a Child position applied via overrideLocatorRelativePosition (#1058)', async () => {
    const child = overrideLocatorRelativePosition(byCssSelector('.child'), 'Child');
    const chain = append(byCssSelector('.parent'), child);
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child');
  });

  test('preserves a Child position through locatorUtil.and() (#1058)', async () => {
    const child = and(byCssSelector('.child', 'Child'), byCssSelector('.active'));
    const chain = append(byCssSelector('.parent'), child);
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child.active');
  });

  test('resolves multiple Root locators in one chain to the LAST one (last-wins)', async () => {
    // findRootLocatorIndex scans back-to-front and returns the first Root it
    // hits — i.e. the last Root in chain order — so everything before it,
    // including an earlier Root, is dropped rather than accumulated.
    const chain = append(
      byCssSelector('.first-root', 'Root'),
      byCssSelector('.between'),
      byCssSelector('.second-root', 'Root'),
      byCssSelector('.after')
    );
    expect(await toCssSelector(chain, stubInteractor)).toBe('.second-root .after');
  });

  // NOT separately tested: the `complexity === 'linked'` skip branch in
  // getEffectiveLocator (locatorUtil.ts:110) is unreachable via this public
  // toCssSelector entry point. toPrimitiveLocators (locatorUtil.ts:89-103) always
  // resolves a Root-positioned LinkedCssLocator into a plain CssLocator (via
  // getLinkedCssLocator -> byAttribute, which only ever constructs CssLocator,
  // never LinkedCssLocator) before findRootLocatorIndex/getEffectiveLocator ever
  // inspect `.complexity` — so by the time that check runs, no element of the
  // list can still be `'linked'`. Confirmed by reading the call chain rather than
  // asserted here, since a passing test would require contriving a value the
  // production code path cannot actually produce.
});

describe('and (same-element composition)', () => {
  it('compounds a second matcher onto the same element', () => {
    const [locator] = and(byRole('button'), byAriaLabel('Open'));
    expect(locator.selector).toBe('[role="button"][aria-label="Open"]');
  });

  it('keeps the base locator position relative to its parent', () => {
    const [descendant] = and(byRole('button'), byAriaLabel('Open'));
    expect(descendant.relative).toBe('Descendant');

    const [root] = and(byRole('dialog', 'Root'), byAriaLabel('Settings'));
    expect(root.relative).toBe('Root');
  });

  it('compounds N matchers in a single call', () => {
    const [locator] = and(byRole('tab'), byAttribute('aria-selected', 'true'), byAttribute('data-state', 'ready'));
    expect(locator.selector).toBe('[role="tab"][aria-selected="true"][data-state="ready"]');
  });

  it('places a leading tag-name matcher at the start of the compound', () => {
    const [locator] = and(byTagName('input'), byAttribute('type', 'text'));
    expect(locator.selector).toBe('input[type="text"]');
  });

  it('produces the same selector as the append(..., "Same") form it supersedes', () => {
    const [composed] = and(byRole('button'), byAriaLabel('Open'));
    const [role] = byRole('button');
    const [appendedChild] = byAriaLabel('Open', 'Same');
    expect(composed.selector).toBe(role.selector + appendedChild.selector);
  });

  it('throws when the base is a linked locator', () => {
    const linked = byLinkedElement()
      .onLinkedElement(byDataTestId('input'))
      .extractAttribute('for')
      .toMatchMyAttribute('id');
    expect(() => and(linked, byRole('button'))).toThrow(/linked/i);
  });

  it('throws when a linked locator is passed as a matcher', () => {
    const linked = byLinkedElement()
      .onLinkedElement(byDataTestId('input'))
      .extractAttribute('for')
      .toMatchMyAttribute('id');
    expect(() => and(byRole('button'), linked)).toThrow(/linked/i);
  });

  it('throws when the base is already a multi-locator chain', () => {
    const chain = append(byCssSelector('.parent'), byCssSelector('.child'));
    expect(() => and(chain, byRole('button'))).toThrow(/chain/i);
  });
});
