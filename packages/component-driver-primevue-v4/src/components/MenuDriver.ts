import {
  byCssSelector,
  byRole,
  IComponentDriverOption,
  Interactor,
  type LocatorRelativePosition,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

/**
 * `role="menu"` lives on the inner `<ul>`, not the teleported root the scene's
 * locator (forwarded `data-testid`) lands on — so the portal re-root anchors on
 * PrimeVue's own `data-pc-name="menu"` root marker instead of the role (unlike
 * the Radix menu drivers, whose `role="menu"` element IS the portalled root).
 */
const menuRootLocator: PartLocator = byCssSelector('[data-pc-name="menu"]', 'Root');
// A ceiling, not a sleep: waitUntil returns as soon as the probe flips. PrimeVue's
// leave transition plus mask teardown lands around 250-350ms in real browsers,
// so the MUI-era 250ms ceiling was borderline; 1000ms absorbs slow engines.
const defaultTransitionDuration = 1000;

/**
 * Option for {@link MenuDriver}.
 */
export interface IMenuDriverOption extends IComponentDriverOption<{}> {
  /**
   * Set when the scene renders this Menu with PrimeVue's `appendTo="self"` —
   * see {@link DialogDriver}'s "Anchoring" doc for the shared mechanism (both
   * drivers portal through PrimeVue's own `Portal` wrapper, which renders
   * in-tree whenever `appendTo === 'self'`). Defaults to `false`.
   */
  selfAnchored?: boolean;
}

/**
 * Driver for the PrimeVue `Menu` component in popup mode.
 *
 * DOM audit (primevue@4.5.5): in popup mode the whole `.p-menu` root
 * teleports (default `appendTo`) under `document.body` and unmounts while
 * closed — existence is the open signal, and the static portal hooks re-root
 * the scene's declared locator at the document root ('Same' onto the
 * `data-pc-name="menu"` element, per the MUI portal recipe). Opening is the
 * consumer's trigger (a button calling `menu.toggle(event)`), so the driver
 * covers the popup surface only. An inline (non-popup) Menu renders the same
 * item DOM in place and the item operations work there too; `isOpen` is then
 * trivially `true`.
 *
 * **Item iteration uses `childListHelper`, not `listHelper`**: PrimeVue
 * renders separators as `<li role="separator">` — the same tag as the
 * `<li role="menuitem">` items — so a plain `:nth-of-type` walk would require
 * the Nth `<li>` to also be a menuitem and silently truncate the list at the
 * first separator (the exact `childListHelper` failure class the root
 * CLAUDE.md records). Activation clicks land on the item's inner
 * `data-pc-section="itemlink"` anchor — see {@link MenuItemDriver}.
 *
 * **Shared base (#1036)**: item iteration/`selectByLabel`/typed-not-found-error
 * logic lives on {@link MenuContentDriverBase}, extracted once `ContextMenu`
 * landed as a second menu-family driver in this package. This class supplies
 * only what's Menu-specific: the popup's portal locator and open/close reads.
 *
 * **Anchoring (`appendTo="self"`, #1033)**: pass `{ selfAnchored: true }` for a
 * scene rendering `appendTo="self"` — see {@link DialogDriver}'s class doc for
 * the shared mechanism (PrimeVue's `Portal` renders in-tree, so the portal
 * hooks fall back to ordinary parent-chain-relative resolution). Default
 * (`selfAnchored` unset) is unchanged.
 */
export class MenuDriver extends MenuContentDriverBase {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IMenuDriverOption>) {
    super(locator, interactor, option);
  }

  static override overriddenParentLocator(option?: Partial<IMenuDriverOption>): Optional<PartLocator> {
    return option?.selfAnchored ? undefined : menuRootLocator;
  }

  static override overrideLocatorRelativePosition(
    option?: Partial<IMenuDriverOption>
  ): Optional<LocatorRelativePosition> {
    return option?.selfAnchored ? undefined : 'Same';
  }

  protected get itemListLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('menu'));
  }

  /** Whether the popup menu is open — PrimeVue mounts it only while open. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the popup to open (mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the popup to close (unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'PrimeVueV4MenuDriver';
  }
}
