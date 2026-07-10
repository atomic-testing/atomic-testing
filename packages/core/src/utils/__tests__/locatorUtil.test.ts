import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import { append, documentRootSelector, overrideLocatorRelativePosition, toCssSelector } from '../locatorUtil';

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
    const chain = [byCssSelector('.parent'), byCssSelector('.child')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent .child');
  });

  test('does not insert a separator for a Same-level locator', async () => {
    const chain = [byCssSelector('.parent'), byCssSelector('.self', 'Same')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent.self');
  });

  test('joins a Child-level locator with the child combinator (#1058)', async () => {
    const chain = [byCssSelector('.parent'), byCssSelector('.child', 'Child')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child');
  });

  test('mixes descendant, child, and same combinators in one chain (#1058)', async () => {
    const chain = [
      byCssSelector('.list'),
      byCssSelector('.row', 'Child'),
      byCssSelector('.active', 'Same'),
      byCssSelector('.icon'),
    ];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.list > .row.active .icon');
  });

  test('does not emit a leading child combinator when a Child locator heads the chain (#1058)', async () => {
    // A child combinator has no left operand at the head of a selector; the head
    // statement must stay bare rather than produce an invalid `> .child`.
    const chain = [byCssSelector('.child', 'Child')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.child');
  });

  test('emits the child combinator after a Root-sliced prefix (#1058)', async () => {
    // getEffectiveLocator slices at the Root, which becomes the bare head; the
    // following Child must still combine against it.
    const chain = [byCssSelector('.ignored'), byCssSelector('.root', 'Root'), byCssSelector('.child', 'Child')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.root > .child');
  });

  test('emits the child combinator after a Same-level compound (#1058)', async () => {
    const chain = [byCssSelector('.a'), byCssSelector('.b', 'Same'), byCssSelector('.c', 'Child')];
    expect(await toCssSelector(chain, stubInteractor)).toBe('.a.b > .c');
  });

  test('carries a Child position applied via overrideLocatorRelativePosition (#1058)', async () => {
    const child = overrideLocatorRelativePosition(byCssSelector('.child'), 'Child');
    const chain = append(byCssSelector('.parent'), child);
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child');
  });

  test('preserves a Child position through CssLocator.and() (#1058)', async () => {
    const child = byCssSelector('.child', 'Child').and(byCssSelector('.active'));
    const chain = append(byCssSelector('.parent'), child);
    expect(await toCssSelector(chain, stubInteractor)).toBe('.parent > .child.active');
  });
});
