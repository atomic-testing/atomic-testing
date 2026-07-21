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
 *
 * `Carousel`'s underlying scroll engine (`embla-carousel@8.6.0`, wrapped by
 * `@fluentui/react-carousel@9.9.10`'s `useEmblaCarousel`) needs two more
 * globals jsdom doesn't implement, `window.matchMedia` and
 * `IntersectionObserver`, unconditionally on its FIRST activation effect —
 * fires the instant the container ref attaches, i.e. on every mount, not
 * only when a consumer opts into responsive breakpoints or visibility
 * tracking. `matchMedia` is needed even with no `breakpoints` configured:
 * `EmblaCarousel`'s `activate()` calls `optionsMediaQueries(...).map(ownerWindow.matchMedia)`
 * — passing `matchMedia` itself as the mapper — and `Array.prototype.map`
 * validates its callback is callable before it checks the array's length,
 * so an empty breakpoints list still throws if `matchMedia` isn't a
 * function at all.
 *
 * Ordering finding (this is why the `ResizeObserver` stub above looked like
 * it "wasn't taking effect" for a Carousel-only render before this stub
 * existed): `activate()` calls `optionsMediaQueries` — the `matchMedia`
 * consumer — before `engine.slidesInView.init()` (the `IntersectionObserver`
 * consumer) and `engine.resizeHandler.init()` (the `ResizeObserver`
 * consumer). With `matchMedia` unstubbed, the mount throws at that first
 * step and neither observer's `init()` is ever reached — so the
 * `ResizeObserver` stub wasn't broken or out of scope, its effect was just
 * masked by an earlier, unrelated throw. All three need to be present for
 * the mount to get past `activate()` at all.
 */
const g = globalThis as unknown as {
  ResizeObserver?: unknown;
  IntersectionObserver?: unknown;
  matchMedia?: unknown;
};

if (typeof g.matchMedia !== 'function') {
  g.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof g.IntersectionObserver !== 'function') {
  g.IntersectionObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): unknown[] {
      return [];
    }
  };
}

if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
