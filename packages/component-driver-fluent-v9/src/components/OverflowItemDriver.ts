import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `OverflowItem` (a child of `Overflow` — see
 * {@link OverflowDriver}).
 *
 * DOM audit (@fluentui/react-overflow@9.9.0): `OverflowItem` renders no
 * wrapper of its own — it clones a `ref` onto its child, which is the
 * element this driver's locator actually resolves (a `data-overflow-item`
 * attribute lands there, set unconditionally while registered). **Overflowed
 * items stay mounted, never removed** — Fluent instead stamps
 * `data-overflowing` on a hidden item (`display: none` via a
 * `.fui-Overflow [data-overflowing]` CSS rule) and removes the attribute
 * once it fits again, so {@link isOverflowing} is a portable, jsdom-safe
 * state read that does not depend on a real layout/CSS engine the way the
 * inherited `isVisible()` (display-computed) would under jsdom.
 */
export class OverflowItemDriver extends ComponentDriver<{}> {
  /** The item's visible label, trimmed. */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.locator);
    return text?.trim();
  }

  /** Whether this item is currently overflowed (hidden behind the "+N" trigger) — see class doc. */
  async isOverflowing(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-overflowing')) != null;
  }

  get driverName(): string {
    return 'FluentV9OverflowItemDriver';
  }
}
