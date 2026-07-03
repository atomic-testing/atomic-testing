/**
 * jsdom does not implement `ResizeObserver`, but `@radix-ui/react-use-size`
 * (used by Slider's thumb sizing and ScrollArea's viewport/scrollbar sizing)
 * constructs one on mount. A missing constructor throws during the mount effect
 * and tears down the whole subtree, so it is polyfilled as an inert no-op —
 * added here (rather than preemptively) because the Wave 4 Slider/ScrollArea
 * scenes are the first in this package to actually hit it.
 *
 * An inert stub (no synthetic entries fired) is deliberate: the behaviour this
 * gates is real layout, which jsdom does not compute. Drivers in this package
 * read ARIA/data attributes and DOM structure, which render faithfully under
 * jsdom regardless of this stub; geometry-dependent assertions are E2E-only
 * (see the `hasLayout`-gated tests in the Slider/ScrollArea suites).
 */
const g = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
