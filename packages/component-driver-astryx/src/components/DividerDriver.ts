import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Divider (`@astryxdesign/core/Divider`) — the
 * `<div role="separator">` rule.
 *
 * The root carries `data-variant`, `data-orientation`, and a mirrored
 * `aria-orientation`. When a `label` is supplied, Divider renders THREE inner
 * `<div>`s (line | label | line), so the label is the middle child
 * (`div:nth-child(2)`); an unlabeled divider renders a single inner `<div>` and no
 * middle child. {@link getLabel} therefore guards on that child's existence and
 * returns `undefined` when the divider is unlabeled. The scene anchors on the
 * forwarded `data-testid` (`role="separator"` is equally valid).
 */
export class DividerDriver extends ComponentDriver<{}> {
  /** The middle inner `<div>` that holds the label — present only when labeled. */
  private get labelSlot(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('div:nth-child(2)'));
  }

  /** The visual variant (`data-variant`): `'subtle'` or `'strong'`. */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  /** The orientation (`data-orientation`): `'horizontal'` or `'vertical'`. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /** The centered label text, or `undefined` when the divider is unlabeled. */
  async getLabel(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.labelSlot))) {
      return undefined;
    }
    return (await this.interactor.getText(this.labelSlot)) ?? undefined;
  }

  override get driverName(): string {
    return 'AstryxDividerDriver';
  }
}
