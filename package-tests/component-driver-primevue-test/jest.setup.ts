// jsdom polyfills for PrimeVue 4. Gaps are added here (test-package-local),
// never as driver-level workarounds — mirroring the precedent set by
// component-driver-radix-test/jest.setup.ts. Real browsers implement all of
// these natively, so every stub below is jsdom-only.

/**
 * jsdom does not implement `window.matchMedia` (no CSS engine to evaluate a
 * media query — https://github.com/jsdom/jsdom/issues/3522). PrimeVue's
 * overlay components bind an orientation media-query listener on mount
 * (`bindMatchMediaOrientationListener` in Select/Menu/etc., to reposition the
 * overlay when a phone rotates), so the very first render of a Select under
 * jsdom throws `matchMedia is not defined` and the whole subtree tears down.
 * The stub reports "no match" with inert listener registration — factually
 * right for an environment that has no viewport orientation at all; real
 * orientation behavior is covered by the Playwright leg.
 */
const g = globalThis as unknown as { matchMedia?: (query: string) => MediaQueryList };
if (typeof g.matchMedia !== 'function') {
  g.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

/**
 * jsdom does not implement `ResizeObserver` (no layout engine to observe).
 * PrimeVue's `TabList` constructs one on mount (`bindResizeObserver`, sizing
 * the active-tab ink bar and the scroll buttons), so rendering any Tabs under
 * jsdom throws `ResizeObserver is not defined` and tears down the subtree.
 * The stub is inert (no synthetic entries) — the behavior it gates is real
 * layout, which jsdom does not compute; the drivers read ARIA/DOM structure,
 * and geometry is the Playwright leg's job. Same precedent as
 * `component-driver-radix-test`/`component-driver-astryx-test`.
 */
const g2 = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof g2.ResizeObserver !== 'function') {
  g2.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

export {};
