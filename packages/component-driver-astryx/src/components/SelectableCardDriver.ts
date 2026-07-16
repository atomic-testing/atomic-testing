import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byInputType,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  IToggleDriver,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  /** The visually-hidden checkbox that carries the card's role, name and state. */
  input: {
    locator: byInputType('checkbox'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Astryx SelectableCard (`@astryxdesign/core/SelectableCard`).
 *
 * The card surface is a plain `<div>` (no role/tabindex) that forwards
 * `data-testid` onto its root; the accessible toggle is a visually-hidden
 * `<input type="checkbox" aria-label>` inside it. The scene anchors the root, and
 * this driver delegates selection/disabled to the inner checkbox — matching the
 * MUI `SwitchDriver` shape.
 */
export class SelectableCardDriver extends ComponentDriver<typeof parts> implements IToggleDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Whether the card is selected (inner checkbox checked). */
  async isSelected(): Promise<boolean> {
    await this.enforcePartExistence('input');
    return this.parts.input.isSelected();
  }

  /**
   * Select/deselect the card.
   *
   * Clicks the visible card surface (`this.locator`) — the real user affordance —
   * rather than the visually-hidden inner checkbox, which Playwright refuses to
   * click (not actionable). The card's click handler flips the checkbox.
   *
   * No-ops on a disabled card rather than clicking it regardless: under
   * jsdom, `userEvent.click` already silently skips a disabled native
   * `<input>` (and the card surface click handler follows suit), but
   * `PlaywrightInteractor.click`'s actionability check instead retries "is
   * enabled" until the click's own timeout — indistinguishable from a hang
   * for a control that can never become enabled. Checking {@link isDisabled}
   * first keeps the no-op behavior identical across every `Interactor`.
   */
  async setSelected(selected: boolean): Promise<void> {
    await this.enforcePartExistence('input');
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  /** Flip the card's selection by clicking the card surface. */
  async toggle(): Promise<void> {
    await this.enforcePartExistence('input');
    await this.interactor.click(this.locator);
  }

  /** Whether the card is disabled (inner checkbox disabled). */
  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('input');
    return this.parts.input.isDisabled();
  }

  /** The card's accessible name (the inner checkbox's `aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.parts.input.locator, 'aria-label');
  }

  get driverName(): string {
    return 'AstryxSelectableCardDriver';
  }
}
