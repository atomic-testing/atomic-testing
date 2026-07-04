/**
 * jsdom implements neither the Pointer Events capture methods nor real pointer
 * capturing at all (`Element.prototype.hasPointerCapture` is simply absent — see
 * https://github.com/jsdom/jsdom/issues/2527, still open). Radix's `Select`
 * trigger unconditionally calls `target.hasPointerCapture(event.pointerId)` in
 * its `onPointerDown` handler (to release a stray capture before opening — see
 * `@radix-ui/react-select`'s `SelectTrigger`), so under jsdom the very first
 * click on any Radix Select throws `target.hasPointerCapture is not a function`
 * and aborts the whole dropdown-open flow. This is the "trigger-click-opens-
 * then-closes" pain point called out in #1003: without this polyfill the click
 * never completes, so the dropdown never opens in the first place (a harder
 * failure than merely closing again).
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
 * jsdom does not implement `ResizeObserver`, and two independent, unrelated
 * Radix code paths construct one on mount:
 *
 * - `@radix-ui/react-use-size` — used by Slider's thumb sizing and ScrollArea's
 *   viewport/scrollbar sizing (Wave 4), and also by `Popover.Arrow` (and the
 *   `Tooltip`/`Select`/`DropdownMenu` content built on the same
 *   `@radix-ui/react-popper` positioning, Wave 1) to measure its anchor.
 *
 * A missing constructor throws during the mount effect and tears down the
 * whole subtree, so — same as `component-driver-astryx-test`'s `jest.setup.ts`
 * — it is polyfilled as an inert no-op, added here (rather than preemptively)
 * because the Wave 4 Slider/ScrollArea and Wave 1 Popover/Tooltip/Select/
 * DropdownMenu scenes are what first hit it.
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

/**
 * jsdom does not expose a `DOMRect` constructor (no layout engine backs one).
 * Radix `ContextMenu` constructs one directly — `new DOMRect(x, y, 0, 0)` — as
 * the virtual popper anchor for the right-click point (see
 * `@radix-ui/react-context-menu`'s virtual `getBoundingClientRect`), so the
 * very first `contextmenu` event on a Radix ContextMenu trigger throws
 * `DOMRect is not defined` under jsdom and the menu never opens (Wave 3, hit
 * by the ContextMenu scene). The polyfill is the spec's plain data holder —
 * jsdom has no geometry to compute, and the drivers assert open state via
 * role/data attributes, never popper coordinates; real positioning is covered
 * by the chromium E2E run.
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
