import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { overlayContainerLocator } from '../internal/overlayLocators';

/**
 * Canonical scene locator for {@link SnackbarDriver}: the
 * `<mat-snack-bar-container>` element MatSnackBar renders. The service offers
 * no `data-testid`/ARIA identity hook on the container, and only one snackbar
 * shows at a time (opening a new one dismisses the previous), so the
 * component tag — Material's public selector — is the stable anchor.
 */
export const snackbarLocator: PartLocator = byTagName('mat-snack-bar-container');

export const snackbarParts = {
  /**
   * The message element — the `[matSnackBarLabel]` directive host (rendered
   * by `SimpleSnackBar`, or authored in a custom snackbar template).
   */
  label: {
    locator: byCssSelector('[matSnackBarLabel]'),
    driver: HTMLElementDriver,
  },
  /**
   * The action button — the `[matSnackBarAction]` directive host. Absent
   * when the snackbar was opened without an action.
   */
  action: {
    locator: byCssSelector('[matSnackBarAction]'),
    driver: HTMLButtonDriver,
  },
  /**
   * The `aria-live` region announcing the message. Material moves the
   * content into it shortly after opening; both before and after the move it
   * stays inside the container, so the label/action parts above are
   * unaffected.
   */
  liveRegion: {
    locator: byCssSelector('[aria-live]'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Upper bound for the show/hide transitions (Material animates ~150ms in,
 * ~75ms out). `waitUntil` returns as soon as the state flips. Auto-dismiss
 * waits should pass the configured `duration` plus headroom instead.
 */
const defaultTransitionDurationMs = 1000;

/**
 * Driver for a snackbar opened through the `MatSnackBar` service.
 *
 * The `<mat-snack-bar-container>` is portaled into the CDK overlay container
 * on `document.body` — outside the test engine's subtree — so this driver
 * re-roots there ({@link SnackbarDriver.overriddenParentLocator}). Unlike the
 * dialog/menu drivers there is no `'Same'` refinement: MatSnackBar exposes no
 * user-settable attribute on the container element, so the scene locator is
 * the exported {@link snackbarLocator} (the container tag) resolved under the
 * overlay container.
 *
 * Auto-dismiss (`duration`) is real wall-clock timing — observe it with
 * {@link waitForClose} (a polling `waitUntil`), never with sleeps.
 */
export class SnackbarDriver extends ComponentDriver<typeof snackbarParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: snackbarParts,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return overlayContainerLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    // The container is a descendant of the overlay container (not the same
    // element), so the scene locator keeps its natural Descendant position.
    return undefined;
  }

  /**
   * The snackbar's message text (trimmed), or `null` when no snackbar is
   * showing.
   */
  async getLabel(): Promise<string | null> {
    if (!(await this.parts.label.exists())) {
      return null;
    }
    const label = await this.parts.label.getText();
    return label?.trim() || null;
  }

  /**
   * The action button's text (trimmed), or `null` when the snackbar has no
   * action.
   */
  async getActionLabel(): Promise<string | null> {
    if (!(await this.parts.action.exists())) {
      return null;
    }
    const label = await this.parts.action.getText();
    return label?.trim() || null;
  }

  /**
   * Click the action button (which dismisses the snackbar).
   */
  async clickAction(): Promise<void> {
    await this.enforcePartExistence('action');
    await this.parts.action.click();
  }

  /**
   * The `aria-live` politeness of the announcement region (`polite` by
   * default, `assertive` for `politeness: 'assertive'`), or `undefined` when
   * no snackbar is showing.
   */
  async getPoliteness(): Promise<Optional<string>> {
    if (!(await this.parts.liveRegion.exists())) {
      return undefined;
    }
    return this.interactor.getAttribute(this.parts.liveRegion.locator, 'aria-live');
  }

  /**
   * Whether the snackbar is showing. Attachment is the open predicate: the
   * CDK removes the snackbar's overlay from the DOM on dismissal (there is no
   * hidden-but-attached state), and a style probe would race the
   * exit-animation detach. Around open/dismiss actions prefer
   * {@link waitForOpen}/{@link waitForClose}, which absorb the enter/exit
   * animation.
   */
  isOpen(): Promise<boolean> {
    return this.exists();
  }

  /**
   * Wait for the snackbar to show.
   * @param timeoutMs
   * @returns true if the snackbar is showing when the wait ends
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /**
   * Wait for the snackbar to be dismissed. For auto-dismiss assertions pass
   * the snackbar's configured `duration` plus animation headroom.
   * @param timeoutMs
   * @returns true if the snackbar is gone when the wait ends
   */
  async waitForClose(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  override get driverName(): string {
    return 'AngularMaterialV21SnackbarDriver';
  }
}
