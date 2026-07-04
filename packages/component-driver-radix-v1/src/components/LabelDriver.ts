import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Radix Label primitive (`Label.Root` from `radix-ui`).
 *
 * `Label.Root` renders a plain native `<label for>` — its only behavioral
 * difference from a bare `<label>` is click-to-focus-without-text-selection, a
 * browser-only nuance with nothing to assert in jsdom (or meaningfully in E2E
 * beyond what native `<label>` already guarantees). The driver surface is
 * therefore the standard label reads: the linked control's `id` and the
 * label's own text (`getText`, inherited from `ComponentDriver`).
 */
export class LabelDriver extends ComponentDriver<{}> {
  /** The `for` attribute — the `id` of the control this label is linked to, or `undefined`. */
  async getFor(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'for');
  }

  get driverName(): string {
    return 'RadixV1LabelDriver';
  }
}
