import { Optional } from '@atomic-testing/core';

import { AstryxFieldInputDriver } from './AstryxFieldInputDriver';

/**
 * Driver for the Astryx TextArea (`@astryxdesign/core/TextArea`).
 *
 * TextArea renders a native `<textarea>` and forwards unknown props
 * (`data-testid`) onto it, so the scene anchors there directly — value
 * read/write and the linked label come from {@link AstryxFieldInputDriver}
 * (`getInputValue` reads a `<textarea>`'s value just like an `<input>`).
 */
export class TextAreaDriver extends AstryxFieldInputDriver {
  /** The number of visible rows (`rows` attribute). */
  async getRows(): Promise<Optional<number>> {
    const rows = await this.interactor.getAttribute(this.locator, 'rows');
    return rows == null ? undefined : Number.parseInt(rows, 10);
  }

  /**
   * The current character count, derived from the value length.
   *
   * Astryx renders a `N/maxLength` counter, but reading the value is engine- and
   * version-independent and avoids parsing display chrome.
   */
  async getCharCount(): Promise<number> {
    const value = await this.getValue();
    return value?.length ?? 0;
  }

  override get driverName(): string {
    return 'AstryxTextAreaDriver';
  }
}
