import { DOMInteractor } from '@atomic-testing/dom-core';
import { nextTick } from 'vue';

/**
 * The Vue-flavored {@link DOMInteractor}: every mutating interaction is
 * followed by `nextTick()` so Vue's reactivity has settled before the driver
 * reads the DOM back — the `act()`/`nextTick()` rule ADR-002 assigns per
 * framework. See {@link runInteraction} for the seam this flush installs
 * through.
 */
export class VueInteractor extends DOMInteractor {
  /**
   * Flush Vue reactivity after every mutating interaction (and both wait
   * conditions) by awaiting `nextTick()`. This is the single seam
   * `DOMInteractor` routes all mutations through (see
   * {@link DOMInteractor.runInteraction}), so a new primitive added to the base
   * settles Vue's DOM automatically — no per-method override to forget.
   */
  protected override async runInteraction<T>(interaction: () => Promise<T>): Promise<T> {
    const result = await interaction();
    await nextTick();
    return result;
  }
}
