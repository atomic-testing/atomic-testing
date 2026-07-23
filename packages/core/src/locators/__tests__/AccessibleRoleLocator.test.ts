import { findByRole } from '../findByRole';

describe('AccessibleRoleLocator (#923)', () => {
  it('defaults to the Descendant relative position', () => {
    const [locator] = findByRole('button', 'Save');
    expect(locator.relative).toBe('Descendant');
  });

  it('carries the relative position passed to the builder', () => {
    const [locator] = findByRole('dialog', undefined, 'Root');
    expect(locator.relative).toBe('Root');
  });

  it("rejects 'Same'/'Child' at compile time — no accname-search equivalent (review follow-up)", () => {
    // @ts-expect-error 'Same' has no meaning for an accname search (see AccessibleRoleLocatorRelativePosition).
    findByRole('button', 'Save', 'Same');
    // @ts-expect-error 'Child' likewise — queryAllByRole/getByRole offer no direct-child-only filter.
    findByRole('button', 'Save', 'Child');
  });

  it('reports accessibleRole complexity, distinct from primitive', () => {
    const [locator] = findByRole('button', 'Save');
    expect(locator.complexity).toBe('accessibleRole');
  });

  it('carries the role and name', () => {
    const [locator] = findByRole('button', 'Save');
    expect(locator.role).toBe('button');
    expect(locator.name).toBe('Save');
  });

  it('supports matching by role alone', () => {
    const [locator] = findByRole('dialog');
    expect(locator.role).toBe('dialog');
    expect(locator.name).toBeUndefined();
  });

  it('carries a human-readable diagnostic selector, never meant to run as CSS', () => {
    const [locator] = findByRole('button', 'Save');
    expect(locator.selector).toContain('button');
    expect(locator.selector).toContain('Save');
  });

  describe('clone', () => {
    it('keeps the role, name, and relative position by default', () => {
      const [locator] = findByRole('button', 'Save', 'Root');
      const cloned = locator.clone();
      expect(cloned.role).toBe('button');
      expect(cloned.name).toBe('Save');
      expect(cloned.relative).toBe('Root');
    });

    it('overrides the name when supplied', () => {
      const [locator] = findByRole('button', 'Save');
      const cloned = locator.clone({ name: 'Cancel' });
      expect(cloned.name).toBe('Cancel');
      expect(cloned.role).toBe('button');
    });

    it('overrides the relative position when supplied', () => {
      const [locator] = findByRole('button', 'Save');
      const cloned = locator.clone({ relative: 'Root' });
      expect(cloned.relative).toBe('Root');
    });
  });
});
