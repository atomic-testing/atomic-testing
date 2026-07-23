import { Interactor } from '../../interactor/Interactor';
import { AccessibleRoleLocator } from '../../locators/AccessibleRoleLocator';
import { byAriaLabel } from '../../locators/byAriaLabel';
import { byAttribute } from '../../locators/byAttribute';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import { byLinkedElement } from '../../locators/byLinkedElement';
import { byRole } from '../../locators/byRole';
import { byTagName } from '../../locators/byTagName';
import { findByRole } from '../../locators/findByRole';
import {
  and,
  append,
  documentRootSelector,
  overrideLocatorRelativePosition,
  splitAtAccessibleRoleLocator,
  toCssSelector,
} from '../locatorUtil';

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

  it('throws when composing an AccessibleRoleLocator (#923)', () => {
    // findByRole() has no CSS representation, so it cannot be folded into a
    // same-element compound the way a primitive by* locator can.
    expect(() => and(byRole('button'), findByRole('button', 'Save'))).toThrow(/primitive/i);
  });
});

describe('splitAtAccessibleRoleLocator (#923)', () => {
  it('returns undefined for a chain with no AccessibleRoleLocator', () => {
    expect(splitAtAccessibleRoleLocator(byDataTestId('submit'))).toBeUndefined();
    expect(splitAtAccessibleRoleLocator([])).toBeUndefined();
  });

  it('splits a bare findByRole() into an empty before and the role locator', () => {
    const locator = findByRole('button', 'Save');
    const split = splitAtAccessibleRoleLocator(locator);
    expect(split?.before).toEqual([]);
    expect(split?.roleLocator).toBeInstanceOf(AccessibleRoleLocator);
    expect(split?.roleLocator.role).toBe('button');
    expect(split?.roleLocator.name).toBe('Save');
  });

  it('splits a scoped findByRole() into its preceding chain and the role locator', () => {
    const scoped = append(byDataTestId('dialog'), findByRole('button', 'Save'));
    const split = splitAtAccessibleRoleLocator(scoped);
    expect(split?.before).toEqual(byDataTestId('dialog'));
    expect(split?.roleLocator.role).toBe('button');
  });

  it('throws when the AccessibleRoleLocator is not the last segment', () => {
    const invalid = append(findByRole('button', 'Save'), byCssSelector('.icon'));
    expect(() => splitAtAccessibleRoleLocator(invalid)).toThrow(/last locator/i);
  });

  it('throws when more than one AccessibleRoleLocator is chained', () => {
    const invalid = append(findByRole('button', 'Save'), findByRole('span', 'Icon'));
    expect(() => splitAtAccessibleRoleLocator(invalid)).toThrow(/last locator/i);
  });
});

describe('toCssSelector rejects AccessibleRoleLocator (#923)', () => {
  it('throws a clear error instead of silently emitting the diagnostic selector as CSS', async () => {
    await expect(toCssSelector(findByRole('button', 'Save'), stubInteractor)).rejects.toThrow(/no CSS representation/i);
  });
});
