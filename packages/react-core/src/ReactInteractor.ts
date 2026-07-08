import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from '@testing-library/react';

export class ReactInteractor extends DOMInteractor {
  /**
   * Flush React by running every mutating interaction (and both wait
   * conditions) inside `act` while holding the `IS_REACT_ACT_ENVIRONMENT`
   * global at `true` for its whole duration. This is the single seam
   * `DOMInteractor` routes all mutations through (see
   * {@link DOMInteractor.runInteraction}), so a new primitive added to the base
   * is flushed here automatically — no per-method override to forget.
   *
   * `@testing-library/react`'s `asyncWrapper` (installed into
   * `@testing-library/dom`'s config, which `user-event` consults) temporarily
   * sets `IS_REACT_ACT_ENVIRONMENT` to `false` around every async `user-event`
   * API call — its contract assumes `user-event` is NOT already running inside
   * `act`. This interactor deliberately nests the whole interaction in `act`,
   * so during that window react-dom sees "act queue active, but the act
   * environment global is false" and logs `The current testing environment is
   * not configured to support act(...)` for every update scheduled by event
   * handlers, focus callbacks, or timers. Update-heavy trees (e.g. Radix
   * primitives) emit thousands of these — enough log volume that CI jest runs
   * were killed mid-run (the "Test Radix components" CI outage of 2026-07-04,
   * introduced when #1014 unified the React module graph and made the outer
   * act queue visible to the components' react-dom).
   *
   * Pinning the global to `true` here is truthful, not suppression: every
   * update in this window IS covered by the surrounding `act`. Pinning is inert
   * for the synthetic `fireEvent`-based primitives (they never trip the
   * asyncWrapper) and correct for the `user-event`-backed ones, so unifying
   * every mutation onto this one wrapper is safe. The original property state is
   * restored before the method resolves.
   */
  protected override async runInteraction<T>(interaction: () => Promise<T>): Promise<T> {
    const g = globalThis as { IS_REACT_ACT_ENVIRONMENT?: unknown };
    const originalDescriptor = Object.getOwnPropertyDescriptor(g, 'IS_REACT_ACT_ENVIRONMENT');
    Object.defineProperty(g, 'IS_REACT_ACT_ENVIRONMENT', {
      configurable: true,
      get: () => true,
      set: () => {
        // Swallow @testing-library/react asyncWrapper's temporary `false`
      },
    });
    try {
      return await act(async () => {
        return await interaction();
      });
    } finally {
      if (originalDescriptor != null) {
        Object.defineProperty(g, 'IS_REACT_ACT_ENVIRONMENT', originalDescriptor);
      } else {
        delete g.IS_REACT_ACT_ENVIRONMENT;
      }
    }
  }
}
