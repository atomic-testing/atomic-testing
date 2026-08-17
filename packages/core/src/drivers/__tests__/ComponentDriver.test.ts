import { PostconditionNotMetError, PostconditionNotMetErrorId } from '../../errors/PostconditionNotMetError';
import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { IComponentDriverOption, ScenePart } from '../../partTypes';
import * as locatorUtil from '../../utils/locatorUtil';
import { waitUntil } from '../../utils/timingUtil';
import { ComponentDriver } from '../ComponentDriver';

// within composes locators and never queries — a PartLocator resolves lazily
// — so a bare interactor stub is enough to assert on everything below.
const stubInteractor = {} as Interactor;

/**
 * A driver option carrying one field beyond the base `parts`, standing in for the
 * driver-specific configuration a real composite driver accepts. Used to prove
 * which children do and do not inherit the host's option.
 */
interface LabeledOption extends Partial<IComponentDriverOption<{}>> {
  label?: string;
}

/** Leaf driver that records what it was constructed with. */
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

/** An interior part that re-roots itself, standing in for a nested portal. */
class PortalDriver extends ComponentDriver<{}> {
  static override overriddenParentLocator(): PartLocator {
    return byDataTestId('portal-root');
  }

  get driverName(): string {
    return 'PortalDriver';
  }
}

/** Chrome the driver author owns. */
const chromeParts = {
  title: { locator: byDataTestId('title'), driver: RecordingDriver },
} satisfies ScenePart;

/** Interior the scene author owns. */
const interiorParts = {
  confirm: { locator: byDataTestId('confirm'), driver: RecordingDriver },
  cancel: { locator: byDataTestId('cancel'), driver: RecordingDriver },
} satisfies ScenePart;

/** A second, unrelated interior — the same host serves both (see below). */
const otherInteriorParts = {
  nameInput: { locator: byDataTestId('name'), driver: RecordingDriver },
} satisfies ScenePart;

/** Dialog-shaped host: fixed chrome, caller-supplied interior. */
class HostDriver extends ComponentDriver<typeof chromeParts> {
  constructor(locator: PartLocator, interactor: Interactor, option: LabeledOption = {}) {
    super(locator, interactor, { ...option, parts: chromeParts });
  }

  get driverName(): string {
    return 'HostDriver';
  }
}

/**
 * A host whose own locator resolves to a wrapper rather than to the surface —
 * the shape MUI's Dialog and Drawer have, where the driver's locator is the Modal
 * root and the caller's content sits inside the paper.
 */
class WrapperHostDriver extends ComponentDriver<typeof chromeParts> {
  constructor(locator: PartLocator, interactor: Interactor, option: LabeledOption = {}) {
    super(locator, interactor, { ...option, parts: chromeParts });
  }

  protected override get interiorLocator(): PartLocator {
    return locatorUtil.append(this.locator, byDataTestId('surface'));
  }

  get driverName(): string {
    return 'WrapperHostDriver';
  }
}

const selectorsOf = (locator: PartLocator): string[] => locator.map(part => part.selector);

describe('ComponentDriver.within', () => {
  it("resolves interior parts as descendants of the host's own locator", () => {
    const host = new HostDriver(byDataTestId('dialog'), stubInteractor);

    const content = host.within(interiorParts);

    expect(selectorsOf(content.confirm.locator)).toEqual(['[data-testid="dialog"]', '[data-testid="confirm"]']);
    expect(selectorsOf(content.cancel.locator)).toEqual(['[data-testid="dialog"]', '[data-testid="cancel"]']);
  });

  it("withholds the host's option from interior children, while chrome parts still receive it", () => {
    const host = new HostDriver(byDataTestId('dialog'), stubInteractor, { label: 'fromHost' });

    // The documented asymmetry: an interior belongs to the scene, so it inherits
    // no driver-specific configuration; the driver's own chrome does.
    expect(host.within(interiorParts).confirm.receivedOption.label).toBeUndefined();
    expect(host.parts.title.receivedOption.label).toBe('fromHost');
  });

  it('serves two distinct interiors from a single host instance', () => {
    const host = new HostDriver(byDataTestId('dialog'), stubInteractor);

    // Not expressible through the `content` option, which admits one scene per
    // driver instance — the motivating capability for the call-time form.
    expect(selectorsOf(host.within(interiorParts).confirm.locator)).toEqual([
      '[data-testid="dialog"]',
      '[data-testid="confirm"]',
    ]);
    expect(selectorsOf(host.within(otherInteriorParts).nameInput.locator)).toEqual([
      '[data-testid="dialog"]',
      '[data-testid="name"]',
    ]);
  });

  it("honors an interior part's portal re-root instead of chaining onto the host", () => {
    const host = new HostDriver(byDataTestId('dialog'), stubInteractor);
    const nested = { panel: { locator: byDataTestId('panel'), driver: PortalDriver } } satisfies ScenePart;

    const content = host.within(nested);

    expect(selectorsOf(content.panel.locator)).toEqual(['[data-testid="portal-root"]', '[data-testid="panel"]']);
  });

  it('returns an empty part map for an empty interior', () => {
    const host = new HostDriver(byDataTestId('dialog'), stubInteractor);

    expect(host.within({})).toEqual({});
  });

  it('resolves against an overridden interiorLocator instead of the host locator', () => {
    const host = new WrapperHostDriver(byDataTestId('dialog'), stubInteractor);

    expect(selectorsOf(host.within(interiorParts).confirm.locator)).toEqual([
      '[data-testid="dialog"]',
      '[data-testid="surface"]',
      '[data-testid="confirm"]',
    ]);
  });

  it("anchors a 'Child'-relative interior part on the surface, not the wrapper", () => {
    const host = new WrapperHostDriver(byDataTestId('dialog'), stubInteractor);
    const direct = { body: { locator: byDataTestId('body', 'Child'), driver: RecordingDriver } } satisfies ScenePart;

    // The failure the anchor exists to prevent: anchored on the wrapper, "direct
    // child" means the chrome the component renders around its surface (MUI's
    // backdrop and focus sentinels), never anything the scene wrote.
    const [, , childPart] = host.within(direct).body.locator;
    expect(childPart.selector).toBe('[data-testid="body"]');
    expect(childPart._relativePosition).toBe('Child');
  });

  it("leaves the driver's own chrome parts anchored on the host locator", () => {
    const host = new WrapperHostDriver(byDataTestId('dialog'), stubInteractor);

    // Chrome is the driver author's; it is addressed from the root the driver was
    // given, and must NOT follow the interior into the surface.
    expect(selectorsOf(host.parts.title.locator)).toEqual(['[data-testid="dialog"]', '[data-testid="title"]']);
  });
});

describe('ComponentDriver.awaitPostcondition', () => {
  /** Exposes the protected helper, and delegates `waitUntil` to the real polling
   * implementation so these assert the actual wait semantics, not a stub's. */
  class PostconditionDriver extends ComponentDriver<{}> {
    get driverName(): string {
      return 'PostconditionDriver';
    }

    run(
      postcondition: string,
      probeFn: () => Promise<boolean> | boolean,
      option?: { readonly timeoutMs?: number }
    ): Promise<void> {
      return this.awaitPostcondition(postcondition, probeFn, option);
    }
  }

  const pollingInteractor = { waitUntil } as unknown as Interactor;
  const makeDriver = () => new PostconditionDriver(byDataTestId('subject'), pollingInteractor);

  it('resolves on the first probe when the postcondition already holds', async () => {
    let probes = 0;
    await makeDriver().run('the state to already hold', () => {
      probes++;
      return true;
    });

    // The happy path must cost nothing: an action whose promise is already kept
    // should not pay a polling delay, or every driver call gets slower.
    expect(probes).toBe(1);
  });

  it('resolves once a postcondition that starts false becomes true', async () => {
    let probes = 0;
    await makeDriver().run('the deferred state to arrive', () => {
      probes++;
      return probes >= 3;
    });

    expect(probes).toBe(3);
  });

  it('supports an async probe', async () => {
    let probes = 0;
    await makeDriver().run('an async probe to report true', async () => {
      probes++;
      return Promise.resolve(probes >= 2);
    });

    expect(probes).toBe(2);
  });

  it('throws PostconditionNotMetError when the postcondition never holds', async () => {
    // The path that matters most and is hardest to reach in an e2e test: an
    // action that cannot keep its promise must fail AT the action, rather than
    // resolving and leaving a downstream read to report a confusing mismatch.
    await expect(makeDriver().run('a state that never arrives', () => false, { timeoutMs: 50 })).rejects.toThrow(
      PostconditionNotMetError
    );
  });

  it('names the unmet postcondition, the timeout and the driver in the error', async () => {
    const error = await makeDriver()
      .run('the dropdown to close', () => false, { timeoutMs: 50 })
      .catch((e: unknown) => e as PostconditionNotMetError);

    expect(error.name).toBe(PostconditionNotMetErrorId);
    expect(error.postcondition).toBe('the dropdown to close');
    expect(error.driverName).toBe('PostconditionDriver');
    // The message carries both halves a maintainer needs to act: what was awaited
    // and how long it was awaited for.
    expect(error.message).toContain('the dropdown to close');
    expect(error.message).toContain('50ms');
  });
});
