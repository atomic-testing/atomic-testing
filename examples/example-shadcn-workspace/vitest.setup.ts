// Tells React 19 it is running inside an act()-aware test environment, which the
// atomic-testing ReactInteractor relies on to flush state updates during tests.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// --- jsdom polyfills for Radix/shadcn overlay primitives -----------------------
// THIS FILE IS THE FIX for the famous "Radix Select won't open in jsdom" pain
// point. jsdom implements none of the pointer-capture / scroll / observer /
// geometry APIs Radix primitives reach for during a single open gesture, so
// without these stubs the very first trigger click on a shadcn <Select> THROWS
// and the dropdown never opens. The stubs are deliberately inert: the drivers
// read state from ARIA/data attributes (which jsdom renders faithfully), and the
// real capture/scroll/layout behaviour is exercised by the Playwright E2E run.
// Mirrors package-tests/component-driver-radix-test/jest.setup.ts.

/**
 * jsdom implements neither the Pointer Events capture methods nor real pointer
 * capturing at all (`Element.prototype.hasPointerCapture` is simply absent — see
 * https://github.com/jsdom/jsdom/issues/2527, still open). Radix's `Select`
 * trigger unconditionally calls `target.hasPointerCapture(event.pointerId)` in
 * its `onPointerDown` handler (to release a stray capture before opening — see
 * `@radix-ui/react-select`'s `SelectTrigger`), so under jsdom the very first
 * click on any Radix/shadcn Select throws `target.hasPointerCapture is not a
 * function` and aborts the whole dropdown-open flow — a harder failure than the
 * widely-reported "opens then immediately closes"; nothing opens at all.
 *
 * The polyfill returns `false` from `hasPointerCapture` (jsdom's dispatchEvent
 * never actually captures a pointer, so "no capture held" is the factually
 * correct answer, not just a convenient stub) and makes `set`/`releasePointerCapture`
 * no-ops. This mirrors real browsers' default (uncaptured) state rather than
 * faking capture semantics jsdom has no layout/hit-testing to back up. Real
 * browsers (verified in the chromium E2E run) implement the full Pointer Events
 * capture API natively, so this gap and its fix are jsdom-only.
 */
const elementProto = globalThis.Element?.prototype as unknown as {
  hasPointerCapture?: (pointerId: number) => boolean;
  setPointerCapture?: (pointerId: number) => void;
  releasePointerCapture?: (pointerId: number) => void;
};

if (elementProto != null && typeof elementProto.hasPointerCapture !== 'function') {
  elementProto.hasPointerCapture = () => false;
  elementProto.setPointerCapture = () => {};
  elementProto.releasePointerCapture = () => {};
}

/**
 * jsdom does not implement `Element.prototype.scrollIntoView` either (no layout
 * engine to compute a target scroll offset). Radix `Select` calls it on the
 * highlighted item as soon as the trigger's `onPointerDown` opens the listbox
 * (`SelectItemText`'s mount effect, to bring the selected/first item into view),
 * so opening a Select is the second jsdom method gap the click hits in the same
 * gesture, right after the `hasPointerCapture` one above. A no-op is accurate
 * for the same reason: jsdom has no scroll geometry to move, and the driver
 * asserts open state via ARIA/data attributes, never scroll offset. Real
 * scroll-into-view behaviour is covered by the chromium E2E run.
 */
if (
  elementProto != null &&
  typeof (elementProto as unknown as { scrollIntoView?: unknown }).scrollIntoView !== 'function'
) {
  (elementProto as unknown as { scrollIntoView: () => void }).scrollIntoView = () => {};
}

/**
 * jsdom does not implement `ResizeObserver`, and Radix's popper-positioned
 * content (`Select`, `DropdownMenu`, `Popover`, `Tooltip` — via
 * `@radix-ui/react-use-size`) constructs one on mount. A missing constructor
 * throws during the mount effect and tears down the whole subtree, so it is
 * polyfilled as an inert no-op. An inert stub (no synthetic entries fired) is
 * deliberate: the behaviour this gates is real layout, which jsdom does not
 * compute; geometry-dependent assertions belong to the E2E run.
 */
const g = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

/**
 * jsdom does not expose a `DOMRect` constructor (no layout engine backs one).
 * Radix `ContextMenu` constructs one directly — `new DOMRect(x, y, 0, 0)` — as
 * the virtual popper anchor for the right-click point, so the very first
 * `contextmenu` event on a Radix ContextMenu trigger throws `DOMRect is not
 * defined` under jsdom and the menu never opens. This app does not use a
 * ContextMenu today, but the polyfill is ported with the rest of the set so the
 * example's setup file covers the full Radix/shadcn surface out of the box.
 * The polyfill is the spec's plain data holder — jsdom has no geometry to
 * compute, and the drivers assert open state via role/data attributes, never
 * popper coordinates; real positioning is covered by the chromium E2E run.
 */
const g2 = globalThis as unknown as { DOMRect?: unknown };
if (typeof g2.DOMRect !== 'function') {
  g2.DOMRect = class DOMRect {
    constructor(
      public x: number = 0,
      public y: number = 0,
      public width: number = 0,
      public height: number = 0
    ) {}
    get top(): number {
      return Math.min(this.y, this.y + this.height);
    }
    get bottom(): number {
      return Math.max(this.y, this.y + this.height);
    }
    get left(): number {
      return Math.min(this.x, this.x + this.width);
    }
    get right(): number {
      return Math.max(this.x, this.x + this.width);
    }
    static fromRect(rect: { x?: number; y?: number; width?: number; height?: number } = {}): DOMRect {
      return new DOMRect(rect.x ?? 0, rect.y ?? 0, rect.width ?? 0, rect.height ?? 0);
    }
    toJSON(): unknown {
      return { ...this, top: this.top, bottom: this.bottom, left: this.left, right: this.right };
    }
  };
}
