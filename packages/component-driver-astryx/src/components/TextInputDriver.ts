import { AstryxFieldInputDriver } from './AstryxFieldInputDriver';

/**
 * Driver for the Astryx TextInput (`@astryxdesign/core/TextInput`).
 *
 * Astryx forwards unknown props (including `data-testid`) onto the inner
 * `<input>`, so the scene anchors this driver directly on that control. Value
 * read/write and `isDisabled` come from {@link AstryxFieldInputDriver}'s
 * `HTMLTextInputDriver` base; label, required/invalid state, and the validation
 * message are resolved via the native a11y links (see the base class).
 */
export class TextInputDriver extends AstryxFieldInputDriver {
  /** Clear the current value. */
  async clear(): Promise<boolean> {
    return this.setValue('');
  }

  /** Press Enter while focused — fires Astryx's `onEnter`. */
  async pressEnter(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'Enter');
  }

  override get driverName(): string {
    return 'AstryxTextInputDriver';
  }
}
