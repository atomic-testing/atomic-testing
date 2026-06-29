import { AstryxFieldInputDriver } from './AstryxFieldInputDriver';

/**
 * Driver for the Astryx TimeInput (`@astryxdesign/core/TimeInput`).
 *
 * TimeInput renders a plain `<input type="text">` whose value is a formatted
 * display string (e.g. `"9:30 AM"`), NOT an ISO time — `getValue` returns that
 * display string. TimeInput does NOT forward `data-testid`, so the scene scopes
 * to the control via a wrapper testid composed with `byInputType('text')`.
 * Value/label/validation come from {@link AstryxFieldInputDriver}; the arrow keys
 * step the focused field segment.
 */
export class TimeInputDriver extends AstryxFieldInputDriver {
  /** Increment the focused time segment via the ArrowUp key. */
  async increment(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'ArrowUp');
  }

  /** Decrement the focused time segment via the ArrowDown key. */
  async decrement(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'ArrowDown');
  }

  override get driverName(): string {
    return 'AstryxTimeInputDriver';
  }
}
