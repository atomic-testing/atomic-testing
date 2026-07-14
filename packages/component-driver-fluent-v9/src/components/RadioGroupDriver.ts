import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `RadioGroup` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders `<div role="radiogroup">`
 * wrapping one `<span class="fui-Radio">` per `Radio` child, each holding a
 * REAL native `<input type="radio" value="...">`. `HTMLRadioButtonGroupDriver`
 * (which this delegates to) reads/writes via `:checked`/`[value=]` filters
 * compounded onto its OWN locator — so, same as its native-`<input>` usage
 * (grouped by a shared `name`), **point this driver's ScenePart locator at the
 * radio INPUTS themselves** (e.g. the `[role="radiogroup"]` container appended
 * with a `input[type="radio"]` descendant selector), not at the
 * `[role="radiogroup"]` wrapper div — the wrapper itself has no `checked` or
 * `value` for those filters to match against. Use {@link RadioDriver} to
 * address a single item directly (its own selected/disabled/label state).
 */
export class RadioGroupDriver extends HTMLRadioButtonGroupDriver {
  override get driverName(): string {
    return 'FluentV9RadioGroupDriver';
  }
}
