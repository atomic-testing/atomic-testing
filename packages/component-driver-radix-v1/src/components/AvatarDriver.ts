import { byTagName, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const imageLocator = byTagName('img');

/**
 * Driver for the Radix Avatar primitive (`Avatar.Root` from `radix-ui`).
 *
 * `Avatar.Image` only mounts a real `<img>` once the browser reports the
 * image loaded (tracked internally via a probe `Image()` instance); before
 * that — or with no `src` at all — `Avatar.Fallback`'s content renders
 * instead. jsdom never fires that load event (no real image decode/network
 * stack), so `hasImage()` is always `false` under jsdom regardless of `src`;
 * the loaded-image path (`hasImage`/`getAltText` returning a real image) is
 * **E2E-only**, mirrored from the MUI v7 `AvatarDriver`'s same img-presence
 * strategy.
 * @see https://www.radix-ui.com/primitives/docs/components/avatar
 */
export class AvatarDriver extends ComponentDriver<{}> {
  private get imageLocator(): PartLocator {
    return locatorUtil.append(this.locator, imageLocator);
  }

  /** Whether the avatar currently renders a loaded image (vs. the fallback). */
  async hasImage(): Promise<boolean> {
    return this.interactor.exists(this.imageLocator);
  }

  /** The image's `alt` text, or `undefined` when the avatar has no loaded image. */
  async getAltText(): Promise<Optional<string>> {
    if (!(await this.hasImage())) {
      return undefined;
    }
    return (await this.interactor.getAttribute(this.imageLocator, 'alt')) ?? undefined;
  }

  /** The fallback's visible text, or `undefined` when a loaded image is showing instead. */
  async getFallbackText(): Promise<Optional<string>> {
    if (await this.hasImage()) {
      return undefined;
    }
    const text = (await this.getText())?.trim();
    return text ? text : undefined;
  }

  override get driverName(): string {
    return 'RadixV1AvatarDriver';
  }
}
