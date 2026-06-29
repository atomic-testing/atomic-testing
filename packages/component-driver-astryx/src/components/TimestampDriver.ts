import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Timestamp (`@astryxdesign/core/Timestamp`) — the semantic
 * `<time>` element.
 *
 * Timestamp renders an outer `<span class="astryx-timestamp">` (carrying the
 * theme `data-*` including `data-format`) wrapping an inner `<time datetime>`.
 * Crucially, the component forwards `data-testid` onto the INNER `<time>`, so this
 * driver anchors there: {@link getText} returns the human-readable display string
 * and {@link getDateTime} returns the machine-readable ISO 8601 `datetime`.
 *
 * `data-format` lives on the PARENT span, not the `<time>`, so it is intentionally
 * NOT exposed here — anchor a separate scene part on the wrapper
 * (`byCssSelector('[data-format]')` with an `HTMLElementDriver`) to read the format
 * without an interactor-side `closest`. The hover tooltip and live updates are
 * browser-only behaviors and are not modeled.
 */
export class TimestampDriver extends ComponentDriver<{}> {
  /** The machine-readable ISO 8601 timestamp (`datetime` attribute on `<time>`). */
  async getDateTime(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'datetime');
  }

  override get driverName(): string {
    return 'AstryxTimestampDriver';
  }
}
