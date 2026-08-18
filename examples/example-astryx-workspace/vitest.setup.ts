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

/**
 * jsdom's `HTMLCanvasElement.getContext` is a stub that logs a noisy
 * "not implemented" console error instead of returning a context. Astryx's
 * `Spinner` draws its ring on a `<canvas>` and already guards `if (!context)
 * return` — the drawing effect no-ops harmlessly — so this only silences the
 * console spam on every Spinner mount; no drawing behaviour is modelled.
 */
const canvasProto = globalThis.HTMLCanvasElement?.prototype as unknown as {
  getContext?: (id: string) => unknown;
};
if (canvasProto != null) {
  canvasProto.getContext = () => null;
}

/**
 * jsdom does not expose the global `CSS` object (CSSOM's `CSS.escape`/`CSS.supports`).
 * Astryx 0.1.9's `Dialog` reads `CSS.escape(titleId)` in a dev-only effect that
 * checks for a `DialogHeader` title to auto-label the modal — `titleId` comes from
 * `useId()`, whose colons (`:r1:`) are exactly what `escape` exists to neutralize
 * in a CSS selector. A missing `CSS` global throws from that effect, tearing down
 * every Dialog-based component (Dialog, AlertDialog, CommandPalette) — which is
 * why upgrading past 0.1.3 broke every test that renders one. Polyfill just
 * `escape` with the CSSOM spec algorithm
 * (https://drafts.csswg.org/cssom/#serialize-an-identifier) — sufficient for
 * driver purposes, which never call any other `CSS` member.
 */
const cssGlobal = globalThis as unknown as { CSS?: { escape?: (value: string) => string } };
if (cssGlobal.CSS == null) {
  cssGlobal.CSS = {};
}
if (typeof cssGlobal.CSS.escape !== 'function') {
  cssGlobal.CSS.escape = (value: string): string => {
    const string = String(value);
    const length = string.length;
    let result = '';
    for (let index = 0; index < length; index++) {
      const codeUnit = string.charCodeAt(index);
      if (codeUnit === 0x0000) {
        result += '�';
        continue;
      }
      if (
        (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
        codeUnit === 0x007f ||
        (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && string.charCodeAt(0) === 0x002d)
      ) {
        result += `\\${codeUnit.toString(16)} `;
        continue;
      }
      if (index === 0 && length === 1 && codeUnit === 0x002d) {
        result += `\\${string.charAt(index)}`;
        continue;
      }
      if (
        codeUnit >= 0x0080 ||
        codeUnit === 0x002d ||
        codeUnit === 0x005f ||
        (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
        (codeUnit >= 0x0061 && codeUnit <= 0x007a)
      ) {
        result += string.charAt(index);
        continue;
      }
      result += `\\${string.charAt(index)}`;
    }
    return result;
  };
}
