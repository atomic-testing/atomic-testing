import { HTMLButtonDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  IReadonlyableDriver,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const defaultTransitionDuration = 250;

export const parts = {
  // Neither `input[type=password]` nor a native `<button>` carries an explicit
  // `role` attribute (their ARIA roles are implicit HTML semantics), and Radix
  // does not add one — so `byRole` (a CSS `[role="…"]` match, not AX-tree-aware;
  // see byRole's own doc comment) cannot locate either. Tag selectors are
  // unambiguous within this driver's scope since PasswordToggleField renders
  // exactly one of each (the house convention for native buttons — see the
  // Astryx drivers' `byCssSelector('button…')` locators).
  input: {
    locator: byCssSelector('input'),
    driver: HTMLTextInputDriver,
  },
  toggle: {
    locator: byCssSelector('button'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Radix PasswordToggleField primitive (`unstable_PasswordToggleField`
 * from `radix-ui`; `@radix-ui/react-password-toggle-field` v0.1.x underneath —
 * hence the `unstable_` export prefix upstream). No Astryx analogue exists; this
 * shape was derived by inspecting the primitive's real rendered DOM and source
 * (`node_modules/@radix-ui/react-password-toggle-field`), not by precedent.
 *
 * `PasswordToggleField.Root` renders no DOM element of its own — it is a pure
 * React context provider around `Input`/`Toggle`/`Icon`/`Slot`. Unlike every other
 * Radix primitive in this package, whose `Root` is itself a rendered node, the
 * scene must supply an explicit wrapping element (e.g. a `<div data-testid>`) for
 * this driver's root locator; `input`/`toggle` are then located within it (see the
 * `parts` doc comment below for why neither can use `byRole`).
 *
 * Visibility carries NO `data-state` (unlike the rest of Radix's state-attribute
 * convention) — the only signal is the input's native `type` attribute
 * (`"password"` hidden / `"text"` visible), which is therefore the portable read
 * for {@link isPasswordVisible}. (Named to avoid colliding with the inherited
 * `ComponentDriver.isVisible`, which asks a different question — CSS visibility of
 * the whole component, not the password's plain-text visibility.)
 */
export class PasswordToggleFieldDriver
  extends ComponentDriver<typeof parts>
  implements IInputDriver<string | null>, IDisableableDriver, IReadonlyableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async getValue(): Promise<string | null> {
    return this.parts.input.getValue();
  }

  async setValue(value: string | null): Promise<boolean> {
    return this.parts.input.setValue(value);
  }

  /** Whether the password is currently shown in plain text (`input[type="text"]`). */
  async isPasswordVisible(): Promise<boolean> {
    return (await this.parts.input.getAttribute('type')) === 'text';
  }

  /**
   * Click the toggle button, then wait for visibility to flip. The click
   * resolves before React commits the resulting re-render, so callers reading
   * {@link isPasswordVisible} or {@link getToggleLabel} right after would
   * otherwise race the stale pre-click state.
   */
  async toggleVisibility(): Promise<void> {
    const wasVisible = await this.isPasswordVisible();
    await this.parts.toggle.click();
    await this.interactor.waitUntil({
      probeFn: () => this.isPasswordVisible(),
      terminateCondition: !wasVisible,
      timeoutMs: defaultTransitionDuration,
    });
  }

  /**
   * The toggle button's accessible name. Radix defaults it to `"Show password"` /
   * `"Hide password"` (based on current visibility) when the consumer supplies
   * neither an explicit `aria-label` nor visible text content.
   */
  async getToggleLabel(): Promise<Optional<string>> {
    return this.parts.toggle.getAttribute('aria-label');
  }

  async isDisabled(): Promise<boolean> {
    return this.parts.input.isDisabled();
  }

  async isReadonly(): Promise<boolean> {
    return this.parts.input.isReadonly();
  }

  override get driverName(): string {
    return 'RadixV1PasswordToggleFieldDriver';
  }
}
