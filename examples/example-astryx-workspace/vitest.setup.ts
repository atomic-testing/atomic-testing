// Tells React 19 it is running inside an act()-aware test environment, which the
// atomic-testing ReactInteractor relies on to flush state updates during tests.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// --- jsdom polyfills for Astryx overlay chrome ---------------------------------
// jsdom implements none of the browser APIs the Astryx components reach for on
// mount/focus/open. Without these stubs, merely rendering a Selector, CommandPalette,
// AlertDialog, Toast, or DateInput popover throws and tears down the React subtree.
// Drivers read state from ARIA/data attributes, so inert stubs are sufficient under
// jsdom; the real open/close/layout behaviour is exercised by the Playwright E2E run.
// Mirrors package-tests/component-driver-astryx-test/jest.setup.ts.

// Native HTML Popover API (Selector/Tooltip/Popover surfaces).
const elementProto = globalThis.HTMLElement?.prototype as unknown as {
  showPopover?: () => void;
  hidePopover?: () => void;
  togglePopover?: () => boolean;
};
if (elementProto != null && typeof elementProto.showPopover !== 'function') {
  elementProto.showPopover = () => {};
  elementProto.hidePopover = () => {};
  elementProto.togglePopover = () => false;
}

// <dialog> modal methods (CommandPalette/AlertDialog). Reflect the `open` attribute
// the drivers read.
const dialogProto = globalThis.HTMLDialogElement?.prototype as unknown as {
  show?: () => void;
  showModal?: () => void;
  close?: (returnValue?: string) => void;
};
if (dialogProto != null && typeof dialogProto.showModal !== 'function') {
  function openDialog(this: HTMLDialogElement): void {
    this.open = true;
  }
  dialogProto.show = openDialog;
  dialogProto.showModal = openDialog;
  dialogProto.close = function close(this: HTMLDialogElement): void {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

// ResizeObserver / IntersectionObserver (scroll-aware chrome constructs these on mount).
const g = globalThis as unknown as { ResizeObserver?: unknown; IntersectionObserver?: unknown };
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

// window.matchMedia (Toast reads the theme via useMediaQuery) and a no-op scrollTo
// (dialog scroll-lock calls it on open).
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
