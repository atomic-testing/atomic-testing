import { byCssSelector, Interactor, PartLocator } from '@atomic-testing/core';

/**
 * Astryx's combobox-family listboxes (Selector, MultiSelector, Typeahead,
 * Tokenizer, CommandPalette) give every `role="option"` a stable, contiguous id of
 * the form `${listboxId}-item-${i}` or `${listboxId}-option-${i}`. Addressing
 * options by that id is the portable way to enumerate them across nested
 * `role="group"` sections — `:nth-of-type`/`:nth-child` cannot, because options may
 * be grouped and interleaved with `role="separator"` dividers. The id is a runtime
 * value (not a StyleX-hashed class), so it stays within the accessibility-first
 * locator strategy.
 */

/** Locator for the option whose id is `${idPrefix}${index}`, re-rooted from the document. */
export function optionAt(idPrefix: string, index: number): PartLocator {
  return byCssSelector(`[id="${idPrefix}${index}"]`, 'Root');
}

/**
 * Yield each option (locator + index) under a listbox whose options carry
 * contiguous `${idPrefix}${i}` ids, walking from index 0 until the next id is
 * absent.
 */
export async function* iterateIndexedOptions(
  interactor: Interactor,
  idPrefix: string
): AsyncGenerator<{ locator: PartLocator; index: number }> {
  for (let index = 0; ; index++) {
    const locator = optionAt(idPrefix, index);
    if (!(await interactor.exists(locator))) {
      return;
    }
    yield { locator, index };
  }
}
