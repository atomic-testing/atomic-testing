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
