import {
  byCssSelector,
  ComponentDriver,
  IDisableableDriver,
  IInputDriver,
  IReadonlyableDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Radix OneTimePasswordField primitive (`unstable_OneTimePasswordField`
 * from `radix-ui`; `@radix-ui/react-one-time-password-field` v0.1.x underneath —
 * hence the `unstable_` export prefix upstream). No Astryx analogue exists; this
 * shape was derived by inspecting the primitive's real rendered DOM and source
 * (`node_modules/@radix-ui/react-one-time-password-field`), not by precedent.
 *
 * There is no native segmented/OTP input type, so Radix renders one `<input>` per
 * character. Each carries `data-radix-otp-input` plus a 0-based `data-radix-index`
 * — the stable, position-addressable anchor this driver walks (mirroring how MUI's
 * `SliderDriver` addresses marks by `data-index`: a positional `:nth-of-type`
 * cannot portably express "the Nth OTP input" when unrelated siblings could be
 * interspersed). The root is a plain `<div role="group">`; a hidden
 * `OneTimePasswordFieldHiddenInput` (aggregate value, for form submission) is
 * optional and not assumed present.
 *
 * Each box independently accepts exactly one character via `Interactor.enterText`
 * (which clears the field before typing), so {@link setValue} types one character
 * per box rather than pasting the full code
 * into the first box. Radix does support autofill-style paste-into-first-box (the
 * SMS-autocomplete UX), but that is a `ClipboardEvent`-shaped interaction with no
 * portable `Interactor` primitive, so it is out of scope here.
 */
export class OneTimePasswordFieldDriver
  extends ComponentDriver<{}>
  implements IInputDriver<string>, IDisableableDriver, IReadonlyableDriver
{
  /** The current code, concatenating every box's value in index order. */
  async getValue(): Promise<string> {
    let result = '';
    for (let index = 0; await this.interactor.exists(this.boxLocator(index)); index++) {
      result += (await this.interactor.getInputValue(this.boxLocator(index))) ?? '';
    }
    return result;
  }

  /**
   * Set the code by typing one character into each box, in index order.
   *
   * @returns `false` (without applying anything) if `code` is longer than the
   * number of rendered boxes; `true` once every character was typed.
   */
  async setValue(code: string): Promise<boolean> {
    const length = await this.getLength();
    if (code.length > length) {
      return false;
    }
    for (let index = 0; index < code.length; index++) {
      await this.interactor.enterText(this.boxLocator(index), code[index]!);
    }
    return true;
  }

  /** The number of character boxes rendered. */
  async getLength(): Promise<number> {
    let count = 0;
    while (await this.interactor.exists(this.boxLocator(count))) {
      count++;
    }
    return count;
  }

  /** Whether the field is disabled (every box shares the field's `disabled` state). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.boxLocator(0));
  }

  /** Whether the field is read-only (every box shares the field's `readOnly` state). */
  async isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.boxLocator(0));
  }

  private boxLocator(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[data-radix-otp-input][data-radix-index="${index}"]`));
  }

  override get driverName(): string {
    return 'RadixV1OneTimePasswordFieldDriver';
  }
}
