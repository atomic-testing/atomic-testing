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
 * jsdom does not implement `ResizeObserver`. Radix `Popover.Arrow` (and
 * `Tooltip`/`Select`/`DropdownMenu` content, all built on the same
 * `@radix-ui/react-popper` positioning) measures its anchor via
 * `@radix-ui/react-use-size`, which constructs a `ResizeObserver` in a layout
 * effect on mount — so opening any popper-based overlay that renders an
 * `Arrow` throws `ResizeObserver is not defined` under jsdom. An inert stub
 * (rather than a controllable mock that fires synthetic entries) is deliberate,
 * mirroring the same call in `component-driver-astryx-test`'s `jest.setup.ts`:
 * the behaviour it gates is layout, which jsdom does not compute, and drivers
 * read open state from ARIA/data attributes, never measured size.
 */
const g = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof g.ResizeObserver !== 'function') {
  g.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
