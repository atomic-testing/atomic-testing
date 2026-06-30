// Tells React 19 it is running inside an act()-aware test environment, which the atomic-testing
// ReactInteractor relies on to flush state updates during tests.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// --- jsdom polyfills for MUI v9 + MUI-X v9 -------------------------------------------------------
// jsdom implements none of the layout/observer APIs that the DataGrid, pickers, and overlays reach
// for on mount. Without these stubs, merely rendering them throws and tears down the React subtree.
// Drivers read state from ARIA/DOM attributes, so inert stubs suffice under jsdom; real layout and
// open/close behaviour is exercised by the Playwright E2E run.
const g = globalThis as unknown as {
  ResizeObserver?: unknown;
  IntersectionObserver?: unknown;
};

if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

if (typeof g.IntersectionObserver !== 'function') {
  g.IntersectionObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): [] {
      return [];
    }
  };
}

// MUI components read the theme/breakpoints via useMediaQuery, and scroll-lock calls scrollTo.
const win = globalThis.window as unknown as {
  matchMedia?: (q: string) => unknown;
  scrollTo?: () => void;
};
if (win != null && typeof win.matchMedia !== 'function') {
  win.matchMedia = (query: string) => ({
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
if (win != null) {
  win.scrollTo = () => {};
}
