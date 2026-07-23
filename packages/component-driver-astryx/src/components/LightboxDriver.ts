import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byAriaLabel,
  byCssSelector,
  byTagName,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  Point,
  ScenePart,
} from '@atomic-testing/core';

import { isDialogOpen, OVERLAY_TRANSITION_MS, waitForDialogOpenState } from '../internal/overlayLifecycle';
import { ButtonDriver } from './ButtonDriver';

// The counter ("1 / 3") is a direct child of the dialog's single wrapper <div>
// that itself has no element children — every sibling wrapper (close/prev/next)
// nests an IconButton's <button>, and the media-area wrapper nests further
// <div>s, so "no element children" uniquely identifies the counter among the
// wrapper's direct children. It never matches the caption <div> either, which
// sits one level deeper (inside the media-area wrapper), not a direct child of
// the top wrapper.
const counterLocator: PartLocator = locatorUtil.append(
  byCssSelector('div', 'Child'),
  byCssSelector('div:not(:has(*))', 'Child')
);

// The media-area wrapper is the <div> with a <div> grandchild wrapping the
// <img>/<video> (two levels down); the caption, when rendered, is that
// wrapper's LAST child that is not also its first (":not(:first-child)" excludes
// the image wrapper itself when it is the sole child, i.e. no caption).
const captionLocator: PartLocator = locatorUtil.append(
  byCssSelector('div:has(> div > img, > div > video)'),
  byCssSelector('*:last-child:not(:first-child)', 'Child')
);

// The image wrapper is the direct parent of the <img>/<video> — Astryx wires
// double-click (zoom) and pointerdown (pan) on this wrapper, not on the media
// element itself, so it's the target for both.
const imageWrapperLocator: PartLocator = byCssSelector('div:has(> img, > video)');

export const parts = {
  closeButton: { locator: byAriaLabel('Close'), driver: ButtonDriver },
  prevButton: { locator: byAriaLabel('Previous'), driver: ButtonDriver },
  nextButton: { locator: byAriaLabel('Next'), driver: ButtonDriver },
  imageWrapper: { locator: imageWrapperLocator, driver: HTMLElementDriver },
  image: { locator: byTagName('img'), driver: HTMLElementDriver },
  video: { locator: byTagName('video'), driver: HTMLElementDriver },
  counter: { locator: counterLocator, driver: HTMLElementDriver },
  caption: { locator: captionLocator, driver: HTMLElementDriver },
} satisfies ScenePart;

/**
 * Driver for the Astryx Lightbox (`@astryxdesign/core/Lightbox`).
 *
 * Like Astryx `Dialog`, Lightbox is a controlled, native `<dialog>` opened with
 * `showModal()` and rendered in place (no portal, hence no
 * `overriddenParentLocator()`). Close/Previous/Next are icon-only buttons
 * anchored by their verbatim `aria-label` (`"Close"`/`"Previous"`/`"Next"`);
 * Previous/Next only render in gallery mode (`media` is an array with more than
 * one item) and are disabled at the first/last item respectively. The counter
 * (`"1 / 3"`) and caption have no role/testid of their own — see the locator
 * comments above for how each is anchored structurally instead of by StyleX class.
 *
 * **jsdom-faithful:** {@link isOpen}, {@link close}, {@link next}/{@link prev},
 * {@link canNext}/{@link canPrev}, {@link getCounter}, {@link getCaption},
 * {@link getCurrentAlt} — all pure structure/attribute reads or clicks that
 * update React state synchronously.
 *
 * **E2E-only:** {@link zoom} and {@link pan} depend on real double-click timing
 * and pointer/layout geometry that jsdom cannot provide (see
 * {@link ComponentDriver.drag}). Escape-to-dismiss is also E2E-only for
 * Lightbox specifically: unlike Astryx `Dialog` (which closes on its own
 * `keydown` handler), Lightbox relies on the native `<dialog>` `cancel` event,
 * which real browsers fire automatically when Escape is pressed on a
 * `showModal()`-opened dialog but jsdom does not synthesize from a dispatched
 * `keydown` — verified empirically, not merely assumed.
 */
export class LightboxDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  /** Whether the lightbox is open — Astryx sets the `<dialog>`'s `open` attribute via `showModal()`. */
  async isOpen(): Promise<boolean> {
    return isDialogOpen(this.interactor, this.locator);
  }

  /** Wait until the lightbox is open. */
  async waitForOpen(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    return waitForDialogOpenState(this.interactor, this.locator, true, timeoutMs);
  }

  /** Wait until the lightbox is closed. */
  async waitForClose(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    return waitForDialogOpenState(this.interactor, this.locator, false, timeoutMs);
  }

  /** Dismiss the lightbox via its close button, then wait for it to close. */
  async close(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    await this.parts.closeButton.click();
    return this.waitForClose(timeoutMs);
  }

  /** Advance to the next gallery item. A no-op when already on the last item (the button is `disabled`). */
  async next(): Promise<void> {
    await this.parts.nextButton.click();
  }

  /** Go back to the previous gallery item. A no-op when already on the first item (the button is `disabled`). */
  async prev(): Promise<void> {
    await this.parts.prevButton.click();
  }

  /** Whether there is a next item to navigate to (`false` outside gallery mode or at the last item). */
  async canNext(): Promise<boolean> {
    if (!(await this.parts.nextButton.exists())) {
      return false;
    }
    return !(await this.parts.nextButton.isDisabled());
  }

  /** Whether there is a previous item to navigate to (`false` outside gallery mode or at the first item). */
  async canPrev(): Promise<boolean> {
    if (!(await this.parts.prevButton.exists())) {
      return false;
    }
    return !(await this.parts.prevButton.isDisabled());
  }

  /** The `"N / total"` gallery counter, or `undefined` outside gallery mode. */
  async getCounter(): Promise<Optional<string>> {
    if (!(await this.parts.counter.exists())) {
      return undefined;
    }
    return (await this.parts.counter.getText()) ?? undefined;
  }

  /** The current item's caption, or `undefined` when the item has none. */
  async getCaption(): Promise<Optional<string>> {
    if (!(await this.parts.caption.exists())) {
      return undefined;
    }
    return (await this.parts.caption.getText()) ?? undefined;
  }

  /** The current item's alt text (`<img alt>`, or a video's `aria-label`). */
  async getCurrentAlt(): Promise<Optional<string>> {
    if (await this.parts.image.exists()) {
      return this.parts.image.getAttribute('alt');
    }
    if (await this.parts.video.exists()) {
      return this.parts.video.getAttribute('aria-label');
    }
    return undefined;
  }

  /**
   * Toggle zoom on the current image (double-click, 1x ↔ 2x). Only meaningful
   * for an image item with zoom enabled (Astryx disables zoom for video).
   *
   * Uses `click({ clickCount: 2 })` for a genuine double-click gesture — two
   * separate `click()` calls do not reliably register as one (verified against
   * a real browser: Playwright's per-click actionability re-checks introduce
   * enough delay to break the double-click timing).
   *
   * E2E-only: real double-click timing and the resulting CSS transform are not
   * something jsdom (no layout engine) can reproduce or verify.
   */
  async zoom(): Promise<void> {
    await this.interactor.click(this.parts.imageWrapper.locator, { clickCount: 2 });
  }

  /**
   * Pan the zoomed image by the given pixel delta (drag). Only takes effect
   * once zoomed in via {@link zoom}. See {@link ComponentDriver.drag} — jsdom
   * has no layout engine, so the positional outcome is E2E-only.
   */
  async pan(delta: Point): Promise<void> {
    await this.interactor.drag(this.parts.imageWrapper.locator, delta);
  }

  get driverName(): string {
    return 'AstryxLightboxDriver';
  }
}
