import { Interactor } from '../../interactor/Interactor';
import { byCssSelector } from '../../locators/byCssSelector';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { IComponentDriverOption, ScenePart } from '../../partTypes';
import { ComponentDriver } from '../ComponentDriver';
import { getPartFromDefinition } from '../driverUtil';

// getPartFromDefinition never calls the interactor itself — it only threads it
// through to the child drivers it constructs — so a bare stub is enough.
const stubInteractor = {} as Interactor;

/**
 * A driver-specific option shape carrying one extra field beyond the base
 * `parts`, mirroring how a real composite driver's option (e.g. a container's
 * `content`, a list's `itemLocator`) extends `IComponentDriverOption`. Used to
 * prove the option-merge precedence below; `parts` itself can't serve that
 * purpose because `getPartFromDefinition` force-clears it unconditionally.
 */
interface LabeledOption extends Partial<IComponentDriverOption<{}>> {
  label?: string;
}

/** A leaf driver that records exactly what it was constructed with, so tests can
 * assert on locator composition and option merging without a real DOM. */
class RecordingDriver extends ComponentDriver<{}> {
  readonly receivedOption: LabeledOption;

  constructor(locator: PartLocator, interactor: Interactor, option: LabeledOption = {}) {
    super(locator, interactor, option);
    this.receivedOption = option;
  }

  get driverName(): string {
    return 'RecordingDriver';
  }
}

/** A driver that re-roots to a fixed locator, standing in for a portal-style
 * composite driver (e.g. a dialog rendered outside its trigger's subtree). */
class PortalDriver extends ComponentDriver<{}> {
  static override overriddenParentLocator(): PartLocator {
    return byDataTestId('portal-root');
  }

  readonly receivedLocator: PartLocator;

  constructor(locator: PartLocator, interactor: Interactor, option: Partial<IComponentDriverOption<{}>> = {}) {
    super(locator, interactor, option);
    this.receivedLocator = locator;
  }

  get driverName(): string {
    return 'PortalDriver';
  }
}

describe('getPartFromDefinition', () => {
  it('chains a child locator as a descendant of the parent locator', () => {
    const parentLocator = byDataTestId('parent');
    const parts = {
      child: { locator: byDataTestId('child'), driver: RecordingDriver },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, parentLocator, stubInteractor, {});

    expect(result.child.locator.map(loc => loc.selector)).toEqual(['[data-testid="parent"]', '[data-testid="child"]']);
    expect(result.child.locator.map(loc => loc.relative)).toEqual(['Descendant', 'Descendant']);
  });

  it('chains a Same-positioned child onto the parent element (no combinator)', () => {
    const parentLocator = byCssSelector('.parent');
    const parts = {
      self: { locator: byCssSelector('.self', 'Same'), driver: RecordingDriver },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, parentLocator, stubInteractor, {});

    expect(result.self.locator.map(loc => loc.selector)).toEqual(['.parent', '.self']);
    expect(result.self.locator.map(loc => loc.relative)).toEqual(['Descendant', 'Same']);
  });

  it("lets a part definition's own optionOverride win over the caller's shared option", () => {
    const parts = {
      child: {
        locator: byDataTestId('child'),
        driver: RecordingDriver,
        option: { label: 'fromOverride' },
      },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, [], stubInteractor, { label: 'fromCaller' } as LabeledOption);

    expect(result.child.receivedOption.label).toBe('fromOverride');
  });

  it("falls back to the caller's shared option when a part defines no override for that field", () => {
    const parts = {
      child: { locator: byDataTestId('child'), driver: RecordingDriver },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, [], stubInteractor, { label: 'fromCaller' } as LabeledOption);

    expect(result.child.receivedOption.label).toBe('fromCaller');
  });

  it("force-clears `parts` on the child's option, never leaking the caller's nested parts or the part definition's own", () => {
    const callerParts = { unrelated: { locator: byDataTestId('unrelated'), driver: RecordingDriver } };
    const ownParts = { alsoUnrelated: { locator: byDataTestId('also-unrelated'), driver: RecordingDriver } };
    const parts = {
      child: {
        locator: byDataTestId('child'),
        driver: RecordingDriver,
        option: { parts: ownParts } as Partial<IComponentDriverOption<{}>>,
      },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, [], stubInteractor, { parts: callerParts } as Partial<
      IComponentDriverOption<{}>
    >);

    expect(result.child.receivedOption.parts).toBeUndefined();
  });

  it('replaces the parent locator entirely when overriddenParentLocator is set, rather than appending to it', () => {
    const parentLocator = byDataTestId('should-be-discarded');
    const parts = {
      portal: { locator: byDataTestId('content'), driver: PortalDriver },
    } satisfies ScenePart;

    const result = getPartFromDefinition(parts, parentLocator, stubInteractor, {});

    expect(result.portal.locator.map(loc => loc.selector)).toEqual([
      '[data-testid="portal-root"]',
      '[data-testid="content"]',
    ]);
  });
});
