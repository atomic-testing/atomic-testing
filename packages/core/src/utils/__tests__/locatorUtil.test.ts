import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import { documentRootSelector, toCssSelector } from '../locatorUtil';

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
});
