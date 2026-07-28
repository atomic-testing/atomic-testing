/**
 * jsdom does not implement the native HTML Popover API, but Astryx tooltips (and
 * other overlay chrome) call `showPopover()` / `hidePopover()` on focus/click —
 * so merely focusing or clicking a control that carries a tooltip throws
 * "showPopover is not a function" under jsdom. Polyfill the methods as no-ops so
 * DOM tests can drive those controls. True popover *visibility* is not modelled
 * here (and is not needed: drivers read state from ARIA/data attributes); the
 * real open/close behaviour is covered by the Playwright E2E run.
 */
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

/**
 * jsdom (v20) does not implement the native `<dialog>` modal methods, but Astryx
 * `Dialog`/`AlertDialog` call `dialog.showModal()` from an effect when opened —
 * which throws "showModal is not a function" and tears down the whole dialog
 * subtree. Mock them to reflect the `open` attribute (which the driver reads),
 * mirroring how Astryx's own component tests stub these. True modal behaviour
 * (top-layer, ::backdrop, focus trap) is not modelled here and is covered by the
 * Playwright E2E run.
 */
const dialogProto = globalThis.HTMLDialogElement?.prototype as unknown as {
  show?: () => void;
  showModal?: () => void;
  close?: (returnValue?: string) => void;
};

if (dialogProto != null && typeof dialogProto.showModal !== 'function') {
  function open(this: HTMLDialogElement): void {
    this.open = true;
  }
  dialogProto.show = open;
  dialogProto.showModal = open;
  dialogProto.close = function close(this: HTMLDialogElement): void {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

/**
 * jsdom implements neither `ResizeObserver` nor `IntersectionObserver`, but Astryx
 * scroll-aware chrome constructs `ResizeObserver` on mount (`Carousel` via
 * `useScrollOverflow`). A missing constructor throws during the mount effect and
 * tears down the subtree, so both are polyfilled as inert no-ops.
 *
 * An inert stub (rather than a controllable mock that fires synthetic entries) is
 * deliberate: the behaviour these gate is *layout*, which jsdom does not compute.
 * `Carousel` decides whether to show its overflow buttons from `scrollWidth` vs
 * `clientWidth` (both `0` here), and `Outline`'s scroll-spy active item is derived
 * from scroll position + `getBoundingClientRect` (see Astryx `useScrollSpy` — it does
 * not even use `IntersectionObserver`). Firing observer callbacks therefore cannot
 * reproduce overflow/scroll-spy without also faking full layout geometry, so those
 * paths are genuinely E2E-only. Drivers read structure and ARIA/data attributes,
 * which render faithfully.
 */
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

/**
 * Astryx `Toast` reads the theme via `useMediaQuery` → `window.matchMedia`, which
 * jsdom does not provide. Polyfill a no-op (no media matches) so toast-bearing
 * scenes render under jsdom; responsive behaviour is a visual concern covered by
 * E2E.
 */
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

/**
 * jsdom ships `window.scrollTo` as a stub that throws "Not implemented"; Astryx's
 * dialog scroll-lock calls it on open, logging noisy errors. Overwrite it
 * unconditionally with a no-op (this setup file only runs under jsdom). The scroll
 * position is irrelevant to driver behaviour.
 */
if (win != null) {
  win.scrollTo = () => {};
}

/**
 * jsdom's `HTMLCanvasElement.getContext` is a stub that logs a noisy
 * "not implemented" console error instead of returning a context. Astryx's
 * `Spinner` draws its ring on a `<canvas>` and already guards `if (!context)
 * return` — the drawing effect no-ops harmlessly — so this only silences the
 * console spam on every Spinner mount; no drawing behaviour is modelled (nor
 * needed: the driver reads the `role="status"`/label, not pixels).
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
 * in a CSS selector. A missing `CSS` global throws `ReferenceError: CSS is not
 * defined` from that effect, tearing down every Dialog-based component (Dialog,
 * AlertDialog, CommandPalette). Polyfill just `escape` with the CSSOM spec
 * algorithm (https://drafts.csswg.org/cssom/#serialize-an-identifier) — sufficient
 * for driver purposes, which never call any other `CSS` member.
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
