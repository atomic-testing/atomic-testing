import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const imageLocator = byCssSelector('img.MuiAvatar-img');

/**
 * Driver for the Material UI v7 Avatar component.
 *
 * An Avatar renders a `.MuiAvatar-root`; with a `src` it contains an
 * `img.MuiAvatar-img`, otherwise it shows letter initials (or an icon). The
 * driver reads the image's `alt`, the presence of the image, and the letter
 * initials accordingly.
 * @see https://mui.com/material-ui/react-avatar/
 */
export class AvatarDriver extends ComponentDriver {
  private get imageLocator(): PartLocator {
    return locatorUtil.append(this.locator, imageLocator);
  }

  /**
   * Whether the avatar renders an image (vs letter/icon fallback).
   */
  async hasImage(): Promise<boolean> {
    return this.interactor.exists(this.imageLocator);
  }

  /**
   * The image's alt text, or `undefined` when the avatar has no image.
   */
  async getAltText(): Promise<Optional<string>> {
    if (!(await this.hasImage())) {
      return undefined;
    }
    return (await this.interactor.getAttribute(this.imageLocator, 'alt')) ?? undefined;
  }

  /**
   * The letter initials of a text avatar, or `undefined` for an image or icon
   * avatar (which render no text).
   */
  async getInitials(): Promise<Optional<string>> {
    if (await this.hasImage()) {
      return undefined;
    }
    const text = (await this.getText())?.trim();
    return text ? text : undefined;
  }

  override get driverName(): string {
    return 'MuiV7AvatarDriver';
  }
}
