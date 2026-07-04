import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Radix AspectRatio primitive (`AspectRatio.Root` from `radix-ui`).
 *
 * AspectRatio is a pure CSS-layout primitive: it renders no ARIA role and no
 * `data-state`, just a `<div data-radix-aspect-ratio-wrapper>` whose inline
 * `padding-bottom` percentage encodes the ratio (`height / width * 100`, the
 * classic intrinsic-ratio technique) wrapping an inner absolutely-positioned
 * content `<div>`. The driver inverts that back to the `width / height` ratio
 * consumers pass in.
 *
 * **Locator note:** `AspectRatio.Root` forwards arbitrary props — including a
 * consumer's `data-testid` — onto the INNER content div, not the
 * ratio-bearing outer wrapper. A scene must therefore anchor on
 * `data-radix-aspect-ratio-wrapper` itself (or descend to it from a testid'd
 * ancestor, as the example scene does) rather than a testid placed directly
 * on `AspectRatio.Root`.
 *
 * Actual rendered pixel geometry is layout and therefore E2E-only (jsdom has
 * no layout engine), consistent with `getBoundingRect`'s documented caveat on
 * `ComponentDriver`; this ratio read is jsdom-safe because it comes from the
 * inline style string, not computed layout.
 * @see https://www.radix-ui.com/primitives/docs/components/aspect-ratio
 */
export class AspectRatioDriver extends ComponentDriver<{}> {
  private static readonly PADDING_BOTTOM_PATTERN = /padding-bottom:\s*([\d.]+)%/;

  /** The configured `width / height` ratio, or `undefined` if it cannot be parsed from `style`. */
  async getRatio(): Promise<Optional<number>> {
    const style = await this.interactor.getAttribute(this.locator, 'style');
    const match = style?.match(AspectRatioDriver.PADDING_BOTTOM_PATTERN);
    if (match == null) {
      return undefined;
    }
    const paddingBottomPercent = parseFloat(match[1]!);
    return paddingBottomPercent === 0 ? undefined : 100 / paddingBottomPercent;
  }

  get driverName(): string {
    return 'RadixV1AspectRatioDriver';
  }
}
