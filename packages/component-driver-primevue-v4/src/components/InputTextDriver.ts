import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the PrimeVue `InputText` component.
 *
 * DOM audit (primevue@4.5.5): renders a bare native
 * `<input type="text" data-pc-name="inputtext">` — the component root IS the
 * input, with `disabled`/`readonly`/`required` as native attributes and the
 * invalid state mirrored to `aria-invalid="true"` (PrimeVue's documented
 * `invalid` prop). Everything a driver needs is exactly
 * `HTMLTextInputDriver`'s surface (`getValue`/`setValue`/`isDisabled`/
 * `isReadonly`/`isRequired`/`isError`), so this driver delegates wholesale
 * rather than reimplementing it.
 */
export class InputTextDriver extends HTMLTextInputDriver {
  override get driverName(): string {
    return 'PrimeVueV4InputTextDriver';
  }
}
