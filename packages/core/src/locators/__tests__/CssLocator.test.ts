import { byAriaLabel } from '../byAriaLabel';
import { byAttribute } from '../byAttribute';
import { byDataTestId } from '../byDataTestId';
import { byLinkedElement } from '../byLinkedElement';
import { byRole } from '../byRole';
import { byTagName } from '../byTagName';

describe('CssLocator.and (same-element composition)', () => {
  it('compounds a second matcher onto the same element', () => {
    const locator = byRole('button').and(byAriaLabel('Open'));
    expect(locator.selector).toBe('[role="button"][aria-label="Open"]');
  });

  it('keeps THIS locator position relative to its parent', () => {
    const descendant = byRole('button').and(byAriaLabel('Open'));
    expect(descendant.relative).toBe('Descendant');

    const root = byRole('dialog', 'Root').and(byAriaLabel('Settings'));
    expect(root.relative).toBe('Root');
  });

  it('compounds N matchers in a single fluent chain', () => {
    const locator = byRole('tab').and(byAttribute('aria-selected', 'true')).and(byAttribute('data-state', 'ready'));
    expect(locator.selector).toBe('[role="tab"][aria-selected="true"][data-state="ready"]');
  });

  it('places a leading tag-name matcher at the start of the compound', () => {
    const locator = byTagName('input').and(byAttribute('type', 'text'));
    expect(locator.selector).toBe('input[type="text"]');
  });

  it('produces the same selector as the locatorUtil.append(..., "Same") form it supersedes', () => {
    const composed = byRole('button').and(byAriaLabel('Open'));
    const appendedChild = byAriaLabel('Open', 'Same');
    expect(composed.selector).toBe(byRole('button').selector + appendedChild.selector);
  });

  it('throws when the receiver is a linked locator', () => {
    const linked = byLinkedElement()
      .onLinkedElement(byDataTestId('input'))
      .extractAttribute('for')
      .toMatchMyAttribute('id');
    expect(() => linked.and(byRole('button'))).toThrow(/linked/i);
  });

  it('throws when a linked locator is passed as an argument', () => {
    const linked = byLinkedElement()
      .onLinkedElement(byDataTestId('input'))
      .extractAttribute('for')
      .toMatchMyAttribute('id');
    expect(() => byRole('button').and(linked)).toThrow(/linked/i);
  });
});
