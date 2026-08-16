import {
  byCssSelector,
  byLinkedElement,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { resolveDescribedByRoleText, resolveLabelledByText } from '../internal/linkedLocators';

/** The trigger `<button>` inside the root — the element carrying every ARIA state. */
const TRIGGER = byCssSelector('button[aria-haspopup="dialog"]');

/**
 * Driver for the Astryx ComplexSelector (`@astryxdesign/core/ComplexSelector`),
 * added in Astryx 0.3.0.
 *
 * ComplexSelector is a **shell**, not a listbox: it owns an accessible trigger and
 * a `dialog` popup, and the caller renders whatever goes inside (a grid of swatches,
 * a nested form, a two-pane picker). So this driver covers the shell — the trigger's
 * text and state, and opening/closing — and hands the popup's interior to the scene
 * through the inherited {@link ComponentDriver.within}, which resolves a
 * caller-supplied `ScenePart` against {@link interiorLocator} (ADR-019).
 *
 * The scene anchors on the root `<div>`, which self-emits `data-testid` plus
 * `data-size`/`data-status`. Inside it the `<button aria-haspopup="dialog">` carries
 * `aria-expanded`, `aria-controls`, `aria-labelledby`, `aria-required`,
 * `aria-invalid`, `aria-busy` and the native `disabled` — every read here is one of
 * those, never a StyleX-hashed class.
 *
 * Popup **visibility** is native-popover behaviour that jsdom does not model, so —
 * as with the rest of the Astryx overlay family — {@link isOpen} reads the
 * React-state-driven `aria-expanded` (faithful everywhere) while what a user can
 * actually see is the E2E run's concern. The popup content is always mounted, so
 * `within(...)` parts read in both environments.
 */
export class ComplexSelectorDriver extends ComponentDriver<{}> {
  protected get trigger(): PartLocator {
    return locatorUtil.append(this.locator, TRIGGER);
  }

  /**
   * The popup's content box, resolved through the trigger's `aria-controls` → the
   * content `id`.
   *
   * A linked locator rather than a class or a `Root`-scoped `id` interpolation:
   * it is lazy (nothing is queried until a part resolves, which is what keeps
   * `within` synchronous) and it is instance-safe — two ComplexSelectors on one
   * page each resolve their own popup, which the shared
   * `astryx-complex-selector-popup` surface class could not distinguish.
   */
  protected override get interiorLocator(): PartLocator {
    return byLinkedElement('Root')
      .onLinkedElement(this.trigger)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
  }

  /**
   * The selector's visible label, resolved through the trigger's `aria-labelledby`
   * → the `Field` label element.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLabelledByText(this.interactor, this.trigger);
  }

  /**
   * The trigger's displayed text — the caller's `triggerLabel` when a value is
   * selected, otherwise the placeholder.
   */
  async getTriggerText(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.trigger))?.trim() || undefined;
  }

  /** Whether the popup is open (`aria-expanded` on the trigger). */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-expanded')) === 'true';
  }

  /** Open the popup if it is not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.trigger);
    }
  }

  /** Close the popup if it is open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.trigger);
    }
  }

  /** Whether the trigger is disabled (native `disabled`). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasAttribute(this.trigger, 'disabled');
  }

  /** Whether the field is required (`aria-required="true"`). */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-required')) === 'true';
  }

  /** Whether the field is in an error state (`aria-invalid="true"`). */
  async isInvalid(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-invalid')) === 'true';
  }

  /**
   * Whether a `changeAction` is still in flight (`aria-busy="true"`).
   *
   * ComplexSelector runs `changeAction` inside a transition and shows the
   * optimistic value while it is pending, so this is how a test waits for the
   * commit rather than for a spinner to appear.
   */
  async isBusy(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-busy')) === 'true';
  }

  /** The size token from the root's `data-size`. */
  async getSize(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-size');
  }

  /** The validation severity from the root's `data-status`, or `undefined` when there is none. */
  async getStatus(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-status');
  }

  /**
   * The `status.message` text, resolved through the trigger's composed
   * `aria-describedby` — the id list also carries the description, so this picks
   * the target carrying `FieldStatus`'s `data-type` severity marker, matching
   * `AstryxFieldInputDriver.getStatusMessage`.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    const describedBy = await this.interactor.getAttribute(this.trigger, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    for (const id of describedBy.split(/\s+/).filter(Boolean)) {
      const statusLocator = byCssSelector(`[id="${id}"][data-type]`, 'Root');
      if (await this.interactor.exists(statusLocator)) {
        return (await this.interactor.getText(statusLocator)) ?? undefined;
      }
    }
    return undefined;
  }

  /**
   * The field's description text, resolved through the trigger's
   * `aria-describedby` — the target *without* a `data-type` marker (that one is
   * the status message). `undefined` when the field carries no description.
   */
  async getDescription(): Promise<Optional<string>> {
    const describedBy = await this.interactor.getAttribute(this.trigger, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    for (const id of describedBy.split(/\s+/).filter(Boolean)) {
      const target = byCssSelector(`[id="${id}"]:not([data-type])`, 'Root');
      if (await this.interactor.exists(target)) {
        return (await this.interactor.getText(target)) ?? undefined;
      }
    }
    return undefined;
  }

  /**
   * The `disabledMessage`-style tooltip text, if the consumer wired one through
   * `aria-describedby`. `undefined` otherwise.
   */
  async getTooltipMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.trigger, 'aria-describedby', 'tooltip');
  }

  override get driverName(): string {
    return 'AstryxComplexSelectorDriver';
  }
}
