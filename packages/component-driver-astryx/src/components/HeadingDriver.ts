import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Heading (`@astryxdesign/core/Heading`) — the semantic
 * `<h1>`–`<h6>` (role `heading`).
 *
 * The visual/semantic `level` is reflected as `data-level` (a numeric string that
 * is ALWAYS present), so {@link getLevel} reads it and parses to a number. The
 * native element tag (`h1`…`h6`) also encodes the level. `aria-level` is emitted
 * ONLY when `accessibilityLevel` differs from `level`, so {@link getAccessibilityLevel}
 * prefers `aria-level` and falls back to `data-level` when the two coincide.
 * The scene anchors on the forwarded `data-testid`.
 */
export class HeadingDriver extends ComponentDriver<{}> {
  /** The heading level (`data-level`, always present) as a number, or `undefined` if unparseable. */
  async getLevel(): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, 'data-level');
    if (raw == null) {
      return undefined;
    }
    const level = Number.parseInt(raw, 10);
    return Number.isNaN(level) ? undefined : level;
  }

  /**
   * The accessibility level as a number. Reads `aria-level` when present (set only
   * when `accessibilityLevel` ≠ `level`), otherwise falls back to the visual
   * {@link getLevel}.
   */
  async getAccessibilityLevel(): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-level');
    if (raw != null) {
      const level = Number.parseInt(raw, 10);
      if (!Number.isNaN(level)) {
        return level;
      }
    }
    return this.getLevel();
  }

  override get driverName(): string {
    return 'AstryxHeadingDriver';
  }
}
