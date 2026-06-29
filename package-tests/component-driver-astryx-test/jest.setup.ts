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
 * scroll-aware chrome constructs them on mount: `Carousel` (via `useScrollOverflow`)
 * and `Outline` (scroll-spy). A missing constructor throws during the mount effect
 * and tears down the subtree. Polyfill both as inert no-ops — they never fire, so
 * the observed *layout* behaviour (overflow buttons, scroll-spy active item) is not
 * modelled here and is covered by the Playwright E2E run; drivers read structure and
 * ARIA/data attributes, which render faithfully.
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
