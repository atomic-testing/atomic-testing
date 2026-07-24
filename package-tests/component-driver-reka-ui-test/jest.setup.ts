// jsdom polyfills for Reka UI, added here (test-package-local) rather than as
// driver-level workarounds if any gap surfaces — mirroring the precedent set
// by component-driver-radix-test/jest.setup.ts and
// component-driver-primevue-test/jest.setup.ts. Separator, Switch, Checkbox,
// and Toggle never touched a jsdom-unimplemented browser API, so this file
// stayed empty through those primitives.

/**
 * jsdom implements neither the Pointer Events capture methods nor real
 * pointer capturing at all (`Element.prototype.hasPointerCapture` is simply
 * absent — see https://github.com/jsdom/jsdom/issues/2527, still open).
 * Reka's `SelectTrigger` unconditionally calls
 * `target.hasPointerCapture(event.pointerId)` in its `onPointerDown` handler
 * (to release a stray capture before opening — see `reka-ui`'s
 * `Select/SelectTrigger.vue`), so under jsdom the very first click on any
 * Reka `Select` throws `target.hasPointerCapture is not a function` and
 * aborts the whole dropdown-open flow — confirmed by rendering the real
 * component under jsdom (`SelectDriver`'s probe test) before adding this
 * polyfill.
 *
 * The polyfill returns `false` from `hasPointerCapture` (jsdom's
 * `dispatchEvent` never actually captures a pointer, so "no capture held" is
 * the factually correct answer, not just a convenient stub) and makes
 * `set`/`releasePointerCapture` no-ops. Real browsers (verified in the
 * chromium E2E run) implement the full Pointer Events capture API natively,
 * so this gap and its fix are jsdom-only.
 *
 * Unlike `component-driver-radix-test`'s counterpart, this package's probe
 * found no accompanying `scrollIntoView` gap for Reka's `Select`: the
 * item-aligned open flow only calls `HTMLElement.focus()` (`focusFirst` in
 * `reka-ui`'s `Menu/utils.ts`), and the one `scrollIntoView` call in Reka's
 * Select tree (`SelectScrollButtonImpl.vue`) is unreached because this
 * package's scenes never render enough items to mount a scroll button. Nor
 * does the `useResizeObserver` call in `SelectItemAlignedPosition.vue` need a
 * stub — `@vueuse/core`'s `useResizeObserver` feature-detects
 * `'ResizeObserver' in window` and simply skips constructing one when it's
 * absent, so it never throws under jsdom to begin with. Add a stub here,
 * documented the same way, the moment a future primitive needs one.
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
 * jsdom does not implement `ResizeObserver` (no layout engine to observe).
 * Reka's `SliderThumbImpl` unconditionally constructs one on mount via
 * `@vueuse/core`'s `useSize` (unlike `Select`'s own `useResizeObserver` call,
 * which feature-detects and skips construction when absent) — confirmed by
 * rendering `SliderDriver`'s probe scene under jsdom before adding this stub:
 * it threw during the mount effect and tore down the whole subtree. The stub
 * is inert (no synthetic entries) — the behavior it gates is real layout,
 * which jsdom does not compute; `SliderDriver` reads ARIA attributes
 * (`aria-valuenow`/`min`/`max`), and geometry (`dragBy`) is the Playwright
 * leg's job. Same precedent as `component-driver-radix-test`/
 * `component-driver-primevue-test`.
 */
const globalWithResizeObserver = globalThis as unknown as { ResizeObserver?: unknown };
if (typeof globalWithResizeObserver.ResizeObserver !== 'function') {
  globalWithResizeObserver.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

export {};
