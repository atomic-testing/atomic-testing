/**
 * jsdom does not implement `ResizeObserver` (no layout engine to observe).
 * `MessageBar`'s `useMessageBarReflow` hook (multiline-layout reflow
 * measurement) constructs one unconditionally on mount — verified: without
 * this polyfill, rendering ANY `MessageBar` throws
 * `TypeError: win.ResizeObserver is not a constructor` and tears down the
 * whole subtree, well before any driver code runs. Same shape of gap (and
 * fix) as `component-driver-radix-test`/`component-driver-primevue-test`'s
 * own `jest.setup.ts`.
 *
 * An inert stub (no synthetic entries fired) is deliberate: the behaviour
 * this gates is real layout, which jsdom does not compute. `MessageBarDriver`
 * reads DOM structure/text, which renders faithfully under jsdom regardless
 * of this stub; real reflow behaviour is E2E-only.
 */
const g = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
