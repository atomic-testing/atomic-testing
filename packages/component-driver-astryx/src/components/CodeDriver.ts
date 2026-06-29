import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Astryx Code (`@astryxdesign/core/Code`) — the inline
 * `<code class="astryx-code">` element.
 *
 * Code is a pure display leaf with NO role and no `data-*` theme attributes; the
 * only thing to read is its text content (inherited {@link getText}). The scene
 * anchors on the forwarded `data-testid`.
 */
export class CodeDriver extends ComponentDriver<{}> {
  override get driverName(): string {
    return 'AstryxCodeDriver';
  }
}
