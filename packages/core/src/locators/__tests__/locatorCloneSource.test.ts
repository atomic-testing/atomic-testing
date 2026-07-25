import { AccessibleRoleLocator } from '../AccessibleRoleLocator';
import { byDataTestId } from '../byDataTestId';
import { CssLocator } from '../CssLocator';
import type { CssLocatorSource } from '../CssLocatorSource';
import { LinkedCssLocator } from '../LinkedCssLocator';

/**
 * `CssLocator.source` is protected — it exists so subclasses can carry it through
 * their own `clone()`. Reading it here is the only way to pin that contract from
 * outside the hierarchy; nothing in production code needs the value.
 */
function readSource(locator: CssLocator): CssLocatorSource | undefined {
  return (locator as unknown as { source?: CssLocatorSource }).source;
}

const source: CssLocatorSource = { _id: 'byDataTestId', id: 'submit', relative: 'Descendant' };
const otherSource: CssLocatorSource = { _id: 'byCssSelector', selector: '.other', relative: 'Descendant' };

describe('clone() preserves the diagnostic source', () => {
  it('CssLocator keeps it', () => {
    const locator = new CssLocator('.item', { relative: 'Descendant', source });

    expect(readSource(locator.clone())).toEqual(source);
  });

  it('AccessibleRoleLocator keeps it', () => {
    const locator = new AccessibleRoleLocator('button', { name: 'Save', relative: 'Descendant', source });

    expect(readSource(locator.clone())).toEqual(source);
  });

  it('LinkedCssLocator keeps it', () => {
    const locator = new LinkedCssLocator('byLinkedElement', {
      relative: 'Descendant',
      source,
      valueExtract: { type: 'attribute', attributeName: 'id' },
      matchingTargetLocator: byDataTestId('input'),
      matchingTargetValueExtract: { type: 'attribute', attributeName: 'for' },
    });

    expect(readSource(locator.clone())).toEqual(source);
  });

  it('survives the relative-position override that locatorUtil.overrideLocatorRelativePosition applies', () => {
    const roleLocator = new AccessibleRoleLocator('dialog', { relative: 'Descendant', source });
    const cloned = roleLocator.clone({ relative: 'Root' });

    expect(cloned.relative).toBe('Root');
    expect(readSource(cloned)).toEqual(source);
  });

  it('lets an explicit override win over the original', () => {
    const roleLocator = new AccessibleRoleLocator('dialog', { relative: 'Descendant', source });

    expect(readSource(roleLocator.clone({ source: otherSource }))).toEqual(otherSource);
  });
});
